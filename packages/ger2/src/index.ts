import * as bb from "bluebird";
import * as _ from "lodash";

import * as moment from "moment";
import MysqlESM from "./mysql";
import MemESM from "./basic-in-memory";
import * as knex from "knex";
import {NamespaceDoestNotExist} from "./errors";

type Actions = { [x: string]: any };

type Configuration = {
  /**
   * minimum_history_required is the minimum amount of events a person has to have to even bother generating recommendations. It is good to stop low confidence recommendations being generated.
   * @default 0
   */
  minimum_history_required?: number;
  /**
   * neighbourhood_search_size the amount of events in the past that are used to search for the neighborhood. This value has the highest impact on performance but past a certain point has no (or negative) impact on recommendations.
   * @default 100
   */
  neighbourhood_search_size?: number;
  /**
   * similarity_search_size is the amount of events in the history used to calculate the similarity between things or people.
   * @default 100
   */
  similarity_search_size?: number;
  /**
   * event_decay_rate the rate at which event weight will decay over time, weight * event_decay_rate ^ (- days since event)
   * @default 1
   */
  event_decay_rate?: number;
  /**
   * neighbourhood_size the number of similar people (or things) that are searched for. This value has a significant performance impact, and increasing it past a point will also gain diminishing returns.
   * @default 25
   */
  neighbourhood_size?: number;
  /**
   * recommendations_per_neighbour the number of recommendations each similar person can offer. This is to stop a situation where a single highly similar person provides all recommendations.
   * @default 10
   */
  recommendations_per_neighbour?: number;
  /**
   * filter_previous_actions it removes recommendations that the person being recommended already has in their history. For example, if a person has already liked xmen, then if filter_previous_actions is ["liked"] they will not be recommended xmen.
   * @default []
   */
  filter_previous_actions?: string[];
  /**
   * time_until_expiry is the number (in seconds) from now() where recommendations that expire will be removed. For example, recommendations on a website might be valid for minutes, where in a email you might recommendations valid for days.
   * @default 0
   */
  time_until_expiry?: number;
  /**
   * actions is an object where the keys are actions names, and the values are action weights that represent the importance of the action
   * @default {}
   */
  actions?: Actions;
  /**
   * current_datetime defines a "simulated" current time that will not use any events that are performed after current_datetime when generating recommendations.
   * @default now()
   */
  current_datetime?: Date;
};

type Recommendation = {
  thing: string;
  weight: number;
  last_actioned_at: string;
  last_expires_at: string;
  people: string[];
};

type RecommendationResult = {
  recommendations: Recommendation[];
  neighbourhood: {
    [x: string]: number;
  };
  confidence: number;
};

//The only stateful things in GER are the ESM and the options
class GER {
  private esm: any;

  constructor(esm) {
    this.esm = esm;
  }

  //###################### Weighted people  #################################

  private calculate_similarities_from_thing(
    namespace: string,
    thing: string,
    things: string[],
    actions,
    configuration,
  ) {
    return this.esm.calculate_similarities_from_thing(
      namespace,
      thing,
      things,
      actions,
      _.clone(configuration),
    );
  }

  private calculate_similarities_from_person(
    namespace,
    person,
    people,
    actions,
    configuration,
  ) {
    return this.esm
      .calculate_similarities_from_person(
        namespace,
        person,
        people,
        actions,
        _.clone(configuration),
      )
      .then((similarities) => {
        similarities[person] = 1; //manually add person to weights
        return similarities;
      });
  }

  private filter_recommendations(
    namespace: string,
    person: string,
    recommendations: { thing: string }[],
    filter_previous_actions: string[],
  ) {
    const recommended_things = _.uniq(
      Array.from(recommendations).map((x) => x.thing),
    );
    return this.esm
      .filter_things_by_previous_actions(
        namespace,
        person,
        recommended_things,
        filter_previous_actions,
      )
      .then(function (filtered_recommendations) {
        const filtered_recs = [];
        for (let rec of Array.from(recommendations)) {
          if (Array.from(filtered_recommendations).includes(rec.thing)) {
            filtered_recs.push(rec);
          }
        }

        return filtered_recs;
      });
  }

  private filter_similarities(similarities): { [x: string]: number } {
    const ns = {};
    for (let pt in similarities) {
      const weight = similarities[pt];
      if (weight !== 0) {
        ns[pt] = weight;
      }
    }
    return ns;
  }

  private neighbourhood_confidence(n_values: number): number {
    //The more similar people found, the more we trust the recommendations
    //15 is a magic number chosen to make 10 around 50% and 50 around 95%
    const pc = 1.0 - Math.pow(Math.E, -n_values / 15);
    //The person confidence multiplied by the mean distance
    return pc;
  }

  private history_confidence(n_history: number): number {
    // The more hisotry (input) the more we trust the recommendations
    // 35 is a magic number to make 100 about 100%
    const hc = 1.0 - Math.pow(Math.E, -n_history / 35);
    return hc;
  }

  private recommendations_confidence(recommendations: { weight: number }[]) {
    if (recommendations.length === 0) {
      return 0;
    }
    // The greater the mean recommendation the more we trust the recommendations
    // 2 is a magic number to make 10 about 100%
    let total_weight = 0;
    for (let r of Array.from(recommendations)) {
      total_weight += r.weight;
    }

    const mean_weight = total_weight / recommendations.length;
    const tc = 1.0 - Math.pow(Math.E, -mean_weight / 2);

    return tc;
  }

  private person_neighbourhood(
    namespace: string,
    person: string,
    actions: Actions,
    configuration: Configuration,
  ) {
    return this.esm.person_neighbourhood(
      namespace,
      person,
      Object.keys(actions),
      _.clone(configuration),
    );
  }

  private thing_neighbourhood(
    namespace: string,
    thing: string,
    actions: Actions,
    configuration: Configuration,
  ): any {
    return this.esm.thing_neighbourhood(
      namespace,
      thing,
      Object.keys(actions),
      _.clone(configuration),
    );
  }

  private recent_recommendations_by_people(
    namespace: string,
    actions: Actions,
    people: string[],
    configuration: Configuration,
  ) {
    return this.esm.recent_recommendations_by_people(
      namespace,
      Object.keys(actions),
      people,
      _.clone(configuration),
    );
  }

  private calculate_people_recommendations(
    similarities,
    recommendations,
    configuration,
  ) {
    let rec;
    const thing_group = {};

    for (rec of Array.from(recommendations)) {
      if (thing_group[rec.thing] === undefined) {
        thing_group[rec.thing] = {
          thing: rec.thing,
          weight: 0,
          last_actioned_at: rec.last_actioned_at,
          last_expires_at: rec.last_expires_at,
          people: [],
        };
      }

      thing_group[rec.thing].last_actioned_at = moment
        .max(
          moment(thing_group[rec.thing].last_actioned_at),
          moment(rec.last_actioned_at),
        )
        .format();
      thing_group[rec.thing].last_expires_at = moment
        .max(
          moment(thing_group[rec.thing].last_expires_at),
          moment(rec.last_expires_at),
        )
        .format();

      thing_group[rec.thing].weight += similarities[rec.person];

      thing_group[rec.thing].people.push(rec.person);
    }

    recommendations = [];
    for (let thing in thing_group) {
      rec = thing_group[thing];
      recommendations.push(rec);
    }

    recommendations = recommendations.sort((x, y) => y.weight - x.weight);
    return recommendations;
  }

  private calculate_thing_recommendations(
    thing,
    similarities,
    neighbourhood,
    configuration,
  ) {
    let recommendations: Recommendation[] = [];

    for (let rec of Array.from(neighbourhood as any[])) {
      recommendations.push({
        thing: rec.thing,
        weight: rec.people.length * similarities[rec.thing], // could be more subtle than n_people * similarity
        last_actioned_at: rec.last_actioned_at,
        last_expires_at: rec.last_expires_at,
        people: rec.people,
      });
    }

    recommendations = recommendations.sort((x, y) => y.weight - x.weight);
    return recommendations;
  }

  private generate_recommendations_for_person(
    namespace: string,
    person: string,
    actions: Actions,
    person_history_count: number,
    configuration: Configuration,
  ) {
    //"Recommendations for a Person"

    return this.person_neighbourhood(namespace, person, actions, configuration)
      .then((people) => {
        return bb.all([
          people,
          this.calculate_similarities_from_person(
            namespace,
            person,
            people,
            actions,
            _.clone(configuration),
          ),
          this.recent_recommendations_by_people(
            namespace,
            actions,
            people.concat(person),
            _.clone(configuration),
          ),
        ]);
      })
      .spread((neighbourhood, similarities, recommendations) => {
        return bb.all([
          neighbourhood,
          similarities,
          this.filter_recommendations(
            namespace,
            person,
            recommendations,
            configuration.filter_previous_actions,
          ),
        ]);
      })
      .spread((neighbourhood, similarities, recommendations) => {
        const recommendations_object: RecommendationResult = {} as any;
        recommendations_object.recommendations = this.calculate_people_recommendations(
          similarities,
          recommendations,
          configuration,
        );
        recommendations_object.neighbourhood = this.filter_similarities(
          similarities,
        );

        const neighbourhood_confidence = this.neighbourhood_confidence(
          neighbourhood.length,
        );
        const history_confidence = this.history_confidence(
          person_history_count,
        );
        const recommendations_confidence = this.recommendations_confidence(
          recommendations_object.recommendations,
        );

        recommendations_object.confidence =
          neighbourhood_confidence *
          history_confidence *
          recommendations_confidence;

        return recommendations_object;
      });
  }

  private generate_recommendations_for_thing(
    namespace: string,
    thing: string,
    actions: Actions,
    thing_history_count: number,
    configuration: Configuration,
  ) {
    //"People who Actioned this Thing also Actioned"

    return this.thing_neighbourhood(namespace, thing, actions, configuration)
      .then((thing_neighbours) => {
        const things = Array.from(thing_neighbours).map(
          (nei: any) => nei.thing,
        );
        return bb.all([
          thing_neighbours,
          this.calculate_similarities_from_thing(
            namespace,
            thing,
            things,
            actions,
            _.clone(configuration),
          ),
        ]);
      })
      .spread((neighbourhood, similarities) => {
        const recommendations_object: RecommendationResult = {} as any;
        recommendations_object.recommendations = this.calculate_thing_recommendations(
          thing,
          similarities,
          neighbourhood,
          configuration,
        );
        recommendations_object.neighbourhood = this.filter_similarities(
          similarities,
        );

        const neighbourhood_confidence = this.neighbourhood_confidence(
          neighbourhood.length,
        );
        const history_confidence = this.history_confidence(thing_history_count);
        const recommendations_confidence = this.recommendations_confidence(
          recommendations_object.recommendations,
        );

        recommendations_object.confidence =
          neighbourhood_confidence *
          history_confidence *
          recommendations_confidence;

        //console.log JSON.stringify(recommendations_object,null,2)

        return recommendations_object;
      });
  }
  // weight people by the action weight
  // find things that those
  // @recent_recommendations_by_people(namespace, action, people.concat(person), configuration.recommendations_per_neighbour)

  private default_configuration(configuration: Configuration): Configuration {
    return _.defaults(
      configuration,
      {
        minimum_history_required: 1,
        neighbourhood_search_size: 100,
        similarity_search_size: 100,
        event_decay_rate: 1,
        neighbourhood_size: 25,
        recommendations_per_neighbour: 5,
        filter_previous_actions: [],
        time_until_expiry: 0,
        actions: {},
        current_datetime: new Date(),
      }, //set the current datetime, useful for testing and ML,
    );
  }

  normalize_actions(in_actions: number[]) {
    let action, weight;
    let total_action_weight = 0;
    for (action in in_actions) {
      weight = in_actions[action];
      if (weight <= 0) {
        continue;
      }
      total_action_weight += weight;
    }

    //filter and normalize actions with 0 weight from actions
    const actions = {};
    for (action in in_actions) {
      weight = in_actions[action];
      if (weight <= 0) {
        continue;
      }
      actions[action] = weight / total_action_weight;
    }
    return actions;
  }

  recommendations_for_thing(
    namespace: string,
    thing: string,
    configuration?: Configuration,
  ): Promise<RecommendationResult> {
    if (!configuration) {
      configuration = {} as any;
    }
    configuration = this.default_configuration(configuration);
    const { actions } = configuration;

    return this.find_events(namespace, {
      actions: Object.keys(actions),
      thing,
      current_datetime: configuration.current_datetime,
      size: 100,
    }).then((events) => {
      if (events.length < configuration.minimum_history_required) {
        return { recommendations: [], confidence: 0 };
      }

      return this.generate_recommendations_for_thing(
        namespace,
        thing,
        actions,
        events.length,
        configuration,
      );
    });
  }

  recommendations_for_person(
    namespace: string,
    person: string,
    configuration?: Configuration,
  ): Promise<RecommendationResult> {
    if (!configuration) {
      configuration = {} as any;
    }
    configuration = this.default_configuration(configuration);
    const { actions } = configuration;

    //first a check or two
    return this.find_events(namespace, {
      actions: Object.keys(actions),
      person,
      current_datetime: configuration.current_datetime,
      size: 100,
    }).then((events) => {
      if (events.length < configuration.minimum_history_required) {
        return { recommendations: [], confidence: 0 };
      }

      return this.generate_recommendations_for_person(
        namespace,
        person,
        actions,
        events.length,
        configuration,
      );
    });
  }

  //#Wrappers of the ESM

  count_events(namespace: string): Promise<number> {
    return this.esm.count_events(namespace);
  }

  estimate_event_count(namespace: string): Promise<number> {
    return this.esm.estimate_event_count(namespace);
  }

  events(
    events: {
      namespace: string;
      person: string;
      action: string;
      thing: string;
      created_at?: Date | string;
      expires_at?: Date | string;
    }[],
  ) {
    return this.esm.add_events(events).then(() => events);
  }

  event(
    namespace: string,
    person: string,
    action: string,
    thing: string,
    dates?: {
      created_at?: Date | string;
      expires_at?: Date | string;
    },
  ) {
    if (!dates) {
      dates = {};
    }
    return this.esm
      .add_event(namespace, person, action, thing, dates)
      .then(() => ({
        person,
        action,
        thing,
      }));
  }

  private find_events(
    namespace: string,
    options?: {
      size?: number;
      page?: number;
      current_datetime?: Date;
      /**
       * In seconds
       */
      time_until_expiry?: number;
      expires_after?: string | Date;
      person?: string;
      action?: string;
      thing?: string;
      people?: string[];
      things?: string[];
      actions?: string[];
    },
  ): Promise<{ person: string; action: string; thing: string }[]> {
    if (!options) {
      options = {} as any;
    }
    return this.esm.find_events(namespace, options);
  }

  delete_events(
    namespace: string,
    person: string,
    action: string,
    thing: string,
  ) {
    return this.esm.delete_events(namespace, person, action, thing);
  }

  namespace_exists(namespace: string): Promise<boolean> {
    return this.esm.exists(namespace);
  }

  list_namespaces(): Promise<string[]> {
    return this.esm.list_namespaces();
  }

  initialize_namespace(namespace: string) {
    return this.esm.initialize(namespace);
  }

  destroy_namespace(namespace: string) {
    return this.esm.destroy(namespace);
  }

  //  DATABASE CLEANING #
  compact_database(
    namespace: string,
    options?: {
      compact_database_person_action_limit: number;
      compact_database_thing_action_limit: number;
      actions: string[];
    },
  ) {
    if (!options) {
      options = {} as any;
    }
    options = _.defaults(options, {
      compact_database_person_action_limit: 1500,
      compact_database_thing_action_limit: 1500,
      actions: [],
    });

    return this.esm
      .pre_compact(namespace)
      .then(() => {
        return this.esm.compact_people(
          namespace,
          options.compact_database_person_action_limit,
          options.actions,
        );
      })
      .then(() => {
        return this.esm.compact_things(
          namespace,
          options.compact_database_thing_action_limit,
          options.actions,
        );
      })
      .then(() => {
        return this.esm.post_compact(namespace);
      });
  }

  compact_database_to_size(namespace: string, number_of_events: number) {
    // Smartly Cut (lossy) the tail of the database (based on created_at) to a defined size
    //STEP 1
    return this.esm.remove_events_till_size(namespace, number_of_events);
  }
}

const createMysqlESM = (config) => {
  return new MysqlESM({ knex: knex(config) });
};

const RET = {
  GER,
  NamespaceDoestNotExist,
  MemESM,
  MysqlESM,
  knex,
  createMysqlESM,
};

export default RET;
