// @ts-nocheck

import * as bb from "bluebird";
import * as _ from "lodash";

import * as moment from "moment";

const event_store = {}
const person_action_store = {}
const thing_action_store = {}

import Errors from "./errors";


//This is a simple implementation of an ESM to demonstrate the API and NOT FOR PRODUCTION PURPOSES
export default  class BasicInMemory {
  constructor(options) {
    if (options == null) {
      options = {}
    }
  }

  initialize(namespace) {
    if (!event_store[namespace]) {
      event_store[namespace] = []
    }
    if (!person_action_store[namespace]) {
      person_action_store[namespace] = {}
    }
    if (!thing_action_store[namespace]) {
      thing_action_store[namespace] = {}
    }
    return bb.try(function () {})
  }

  destroy(namespace) {
    delete event_store[namespace]
    delete person_action_store[namespace]
    delete thing_action_store[namespace]
    return bb.try(function () {})
  }

  exists(namespace) {
    return bb.try(() => !!event_store[namespace])
  }

  list_namespaces() {
    return bb.try(() => Object.keys(event_store))
  }
  //##########################
  //###  NEIGHBOURHOOD  ######
  //##########################

  thing_neighbourhood(namespace, thing, actions, options) {
    if (options == null) {
      options = {}
    }
    if (!actions || actions.length === 0) {
      return bb.try(() => [])
    }

    options = _.defaults(options, {
      neighbourhood_size: 100,
      neighbourhood_search_size: 500,
      time_until_expiry: 0,
      current_datetime: new Date(),
    })
    options.actions = actions
    options.expires_after = moment(options.current_datetime)
      .add(options.time_until_expiry, "seconds")
      .format()

    let one_degree_away = this._one_degree_away(
      namespace,
      "thing",
      "person",
      thing,
      _.clone(options)
    )

    one_degree_away = one_degree_away.filter(
      (x) =>
        x.thing !== thing &&
        !!x.last_expires_at &&
        !moment(x.last_expires_at).isBefore(options.expires_after)
    )
    one_degree_away.map(function (x) {
      x.people = _.uniq(x.person)
      return delete x.person
    })
    one_degree_away = _.sortBy(one_degree_away, (x) => -x.people.length)
    return bb.try(() => one_degree_away.slice(0, options.neighbourhood_size))
  }

  person_neighbourhood(namespace, person, actions, options) {
    let x
    if (options == null) {
      options = {}
    }
    if (!actions || actions.length === 0) {
      return bb.try(() => [])
    }

    options = _.defaults(options, {
      neighbourhood_size: 100,
      neighbourhood_search_size: 500,
      time_until_expiry: 0,
      current_datetime: new Date(),
    })
    options.actions = actions
    options.expires_after = moment(options.current_datetime)
      .add(options.time_until_expiry, "seconds")
      .format()

    const one_degree_away = this._one_degree_away(
      namespace,
      "person",
      "thing",
      person,
      _.clone(options)
    )

    const query_hash = _.clone(options)
    query_hash.people = one_degree_away.map((x) => x.person)
    const unexpired_events = (() => {
      const result = []
      for (x of Array.from(this._find_events(namespace, query_hash))) {
        if (person !== x.person) {
          result.push(x.person)
        }
      }
      return result
    })()

    return bb.try(() =>
      _.uniq(unexpired_events).slice(0, options.neighbourhood_size)
    )
  }

  _one_degree_away(namespace, column1, column2, value, options) {
    const search_hash = {
      current_datetime: options.current_datetime,
      actions: options.actions,
      size: options.neighbourhood_search_size,
    }

    const search_hash_1 = _.clone(search_hash)
    search_hash_1[column1] = value

    const ret = {}
    for (let x of Array.from(this._find_events(namespace, search_hash_1))) {
      const search_hash_2 = _.clone(search_hash)
      search_hash_2[column2] = x[column2]
      for (let y of Array.from(this._find_events(namespace, search_hash_2))) {
        if (ret[y[column1]] === undefined) {
          ret[y[column1]] = {
            [column1]: y[column1],
            [column2]: [y[column2]],
            last_actioned_at: y.created_at,
            last_expires_at: y.expires_at,
          }
        } else {
          ret[y[column1]][column2].push(y[column2])
          ret[y[column1]].last_actioned_at = moment
            .max(moment(ret[y[column1]].last_actioned_at), moment(y.created_at))
            .toDate()

          if (ret[y[column1]].last_expires_at === null) {
            ret[y[column1]].last_expires_at = y.expires_at
          } else if (y.expires_at !== null) {
            ret[y[column1]].last_expires_at = moment
              .max(
                moment(ret[y[column1]].last_expires_at),
                moment(y.expires_at)
              )
              .toDate()
          }
        }
      }
    }

    return _.values(ret)
  }

  //#################################
  //###  END OF NEIGHBOURHOOD  ######
  //#################################

  _cosine_distance(
    namespace,
    column1,
    column2,
    v1,
    v2,
    actions,
    now,
    limit,
    event_decay_rate
  ) {
    let days, e, n_weight, value, weight
    const search1 = { current_datetime: now }
    const search2 = { current_datetime: now }
    search1[column1] = v1
    search2[column1] = v2
    search1.actions = Object.keys(actions)
    search2.actions = Object.keys(actions)

    const p1_values = {}
    for (e of Array.from(
      this._find_events(namespace, search1).slice(0, limit)
    )) {
      weight = actions[e.action]
      days = Math.round(
        moment.duration(moment(now).diff(e.created_at)).asDays()
      )
      n_weight = weight * Math.pow(event_decay_rate, -days)
      p1_values[e[column2]] = n_weight
    }

    const p2_values = {}
    for (e of Array.from(
      this._find_events(namespace, search2).slice(0, limit)
    )) {
      weight = actions[e.action]
      days = Math.round(
        moment.duration(moment(now).diff(e.created_at)).asDays()
      )
      n_weight = weight * Math.pow(event_decay_rate, -days)
      p2_values[e[column2]] = n_weight
    }

    let numerator = 0
    for (value in p1_values) {
      weight = p1_values[value]
      if (p2_values[value]) {
        numerator += weight * p2_values[value]
      }
    }

    let denominator_1 = 0
    for (value in p1_values) {
      weight = p1_values[value]
      denominator_1 += Math.pow(weight, 2)
    }

    let denominator_2 = 0
    for (value in p2_values) {
      weight = p2_values[value]
      denominator_2 += Math.pow(weight, 2)
    }

    const cosinse_similarity =
      numerator / (Math.sqrt(denominator_1) * Math.sqrt(denominator_2))

    return cosinse_similarity
  }

  _similarities(namespace, column1, column2, value, values, actions, options) {
    if (options == null) {
      options = {}
    }
    if (values.length === 0) {
      return bb.try(() => ({}))
    }

    options = _.defaults(options, {
      similarity_search_size: 500,
      current_datetime: new Date(),
      event_decay_rate: 1,
    })

    const similarities = {}
    for (let v of Array.from(values)) {
      similarities[v] = this._cosine_distance(
        namespace,
        column1,
        column2,
        value,
        v,
        actions,
        options.current_datetime,
        options.similarity_search_size,
        options.event_decay_rate
      )
      similarities[v] = similarities[v] || 0
    }

    return bb.try(() => similarities)
  }

  calculate_similarities_from_person(
    namespace,
    person,
    people,
    actions,
    options
  ) {
    if (options == null) {
      options = {}
    }
    return this._similarities(
      namespace,
      "person",
      "thing",
      person,
      people,
      actions,
      options
    )
  }

  calculate_similarities_from_thing(
    namespace,
    person,
    people,
    actions,
    options
  ) {
    if (options == null) {
      options = {}
    }
    return this._similarities(
      namespace,
      "thing",
      "person",
      person,
      people,
      actions,
      options
    )
  }

  _recent_events(namespace, column1, actions, values, options) {
    let event, last_actioned_at
    if (options == null) {
      options = {}
    }
    if (values.length === 0 || actions.length === 0) {
      return bb.try(() => [])
    }

    options = _.defaults(options, {
      recommendations_per_neighbour: 10,
      time_until_expiry: 0,
      current_datetime: new Date(),
    })
    options.actions = actions

    let all_events = []
    for (let v of Array.from(values)) {
      const query_hash = { actions }
      query_hash[column1] = v

      const events = this._find_events(
        namespace,
        _.extend(query_hash, options)
      ).slice(0, options.recommendations_per_neighbour)
      all_events = all_events.concat(events)
    }

    const group_by_person_thing = {}

    for (event of Array.from(all_events)) {
      if (!group_by_person_thing[event.person]) {
        group_by_person_thing[event.person] = {}
      }
      if (!group_by_person_thing[event.person][event.thing]) {
        group_by_person_thing[event.person][event.thing] = {}
      }

      last_actioned_at =
        group_by_person_thing[event.person][event.thing].last_actioned_at ||
        event.created_at
      last_actioned_at = moment
        .max(moment(last_actioned_at), moment(event.created_at))
        .toDate()

      let last_expires_at =
        group_by_person_thing[event.person][event.thing].last_expires_at ||
        event.expires_at
      last_expires_at = moment
        .max(moment(last_expires_at), moment(event.expires_at))
        .toDate()

      group_by_person_thing[event.person][event.thing] = {
        person: event.person,
        thing: event.thing,
        last_actioned_at,
        last_expires_at,
      }
    }

    let grouped_events = []
    for (let person in group_by_person_thing) {
      const thing_events = group_by_person_thing[person]
      for (let thing in thing_events) {
        event = thing_events[thing]
        grouped_events = grouped_events.concat(event)
      }
    }

    grouped_events = _.sortBy(
      grouped_events,
      (x) => -x.last_actioned_at.getTime()
    )
    return bb.try(() => grouped_events)
  }

  recent_recommendations_by_people(namespace, actions, people, options) {
    return this._recent_events(namespace, "person", actions, people, options)
  }

  _filter_things_by_previous_action(namespace, person, things, action) {
    return things.filter(
      (t) =>
        !person_action_store[namespace][person] ||
        !person_action_store[namespace][person][action] ||
        !person_action_store[namespace][person][action][t]
    )
  }

  filter_things_by_previous_actions(namespace, person, things, actions) {
    if (!actions || actions.length === 0 || things.length === 0) {
      return bb.try(() => things)
    }
    let filtered_things = things
    for (let action of Array.from(actions)) {
      filtered_things = _.intersection(
        filtered_things,
        this._filter_things_by_previous_action(
          namespace,
          person,
          things,
          action
        )
      )
    }
    return bb.try(() => filtered_things)
  }

  add_events(events) {
    const promises = []
    for (let e of Array.from(events)) {
      promises.push(
        this.add_event(e.namespace, e.person, e.action, e.thing, {
          created_at: e.created_at,
          expires_at: e.expires_at,
        })
      )
    }
    return bb.all(promises)
  }

  add_event(namespace, person, action, thing, dates) {
    if (dates == null) {
      dates = {}
    }
    if (!event_store[namespace]) {
      return bb.try(function () {
        throw new Errors.NamespaceDoestNotExist()
      })
    }

    const created_at = moment(dates.created_at || new Date()).toDate()
    const expires_at = dates.expires_at
      ? moment(new Date(dates.expires_at)).toDate()
      : null
    const found_event = this._find_event(namespace, person, action, thing)

    if (found_event) {
      found_event.created_at =
        created_at > found_event.created_at
          ? created_at
          : found_event.created_at
      found_event.expires_at =
        expires_at && expires_at > found_event.expires_at
          ? expires_at
          : found_event.expires_at
    } else {
      const e = { person, action, thing, created_at, expires_at }
      event_store[namespace].push(e)

      if (!person_action_store[namespace][person]) {
        person_action_store[namespace][person] = {}
      }
      if (!person_action_store[namespace][person][action]) {
        person_action_store[namespace][person][action] = {}
      }
      person_action_store[namespace][person][action][thing] = e

      if (!thing_action_store[namespace][thing]) {
        thing_action_store[namespace][thing] = {}
      }
      if (!thing_action_store[namespace][thing][action]) {
        thing_action_store[namespace][thing][action] = {}
      }
      thing_action_store[namespace][thing][action][person] = e
    }

    return bb.try(() => true)
  }

  count_events(namespace) {
    return bb.try(() => event_store[namespace].length)
  }

  estimate_event_count(namespace) {
    return bb.try(() => event_store[namespace].length)
  }

  _find_event(namespace, person, action, thing) {
    if (!person_action_store[namespace][person]) {
      return null
    }
    if (!person_action_store[namespace][person][action]) {
      return null
    }
    if (!person_action_store[namespace][person][action][thing]) {
      return null
    }
    return person_action_store[namespace][person][action][thing]
  }

  _filter_event(e, options) {
    if (!e) {
      return false
    }

    let add = true
    if (moment(options.current_datetime).isBefore(e.created_at)) {
      add = false
    }

    if (
      options.expires_after &&
      (!e.expires_at || moment(e.expires_at).isBefore(options.expires_after))
    ) {
      add = false
    }

    if (options.people) {
      if (!_.includes(options.people, e.person)) {
        add = false
      }
    }

    if (options.person) {
      if (options.person !== e.person) {
        add = false
      }
    }

    if (options.actions) {
      if (!_.includes(options.actions, e.action)) {
        add = false
      }
    }

    if (options.action) {
      if (options.action !== e.action) {
        add = false
      }
    }

    if (options.things) {
      if (!_.includes(options.things, e.thing)) {
        add = false
      }
    }

    if (options.thing) {
      if (options.thing !== e.thing) {
        add = false
      }
    }

    return add
  }

  _find_events(namespace, options) {
    let t, e, at, ats, thth
    if (options == null) {
      options = {}
    }
    options = _.defaults(options, {
      size: 50,
      page: 0,
      current_datetime: new Date(),
    })

    if (options.time_until_expiry !== undefined) {
      options.expires_after = moment(options.current_datetime)
        .add(options.time_until_expiry, "seconds")
        .format()
    }

    //returns all events fitting the above description
    let events = []

    if (options.person && options.action && options.thing) {
      e = __guard__(
        __guard__(
          person_action_store[namespace] != null
            ? person_action_store[namespace][options.person]
            : undefined,
          (x1) => x1[options.action]
        ),
        (x) => x[options.thing]
      )
      events = [e]
    } else if (options.person && options.action) {
      events = (() => {
        const result = []
        for (t in __guard__(
          person_action_store[namespace] != null
            ? person_action_store[namespace][options.person]
            : undefined,
          (x2) => x2[options.action]
        )) {
          e = __guard__(
            person_action_store[namespace] != null
              ? person_action_store[namespace][options.person]
              : undefined,
            (x2) => x2[options.action]
          )[t]
          result.push(e)
        }
        return result
      })()
    } else if (options.thing && options.action) {
      events = (() => {
        const result1 = []
        for (t in __guard__(
          thing_action_store[namespace] != null
            ? thing_action_store[namespace][options.thing]
            : undefined,
          (x3) => x3[options.action]
        )) {
          e = __guard__(
            thing_action_store[namespace] != null
              ? thing_action_store[namespace][options.thing]
              : undefined,
            (x3) => x3[options.action]
          )[t]
          result1.push(e)
        }
        return result1
      })()
    } else if (options.person) {
      events = (() => {
        const result2 = []
        for (at in person_action_store[namespace] != null
          ? person_action_store[namespace][options.person]
          : undefined) {
          ats = (
            person_action_store[namespace] != null
              ? person_action_store[namespace][options.person]
              : undefined
          )[at]
          result2.push(
            (() => {
              const result3 = []
              for (t in ats) {
                e = ats[t]
                result3.push(e)
              }
              return result3
            })()
          )
        }
        return result2
      })()
    } else if (options.thing) {
      events = (() => {
        const result4 = []
        for (at in thing_action_store[namespace] != null
          ? thing_action_store[namespace][options.thing]
          : undefined) {
          ats = (
            thing_action_store[namespace] != null
              ? thing_action_store[namespace][options.thing]
              : undefined
          )[at]
          result4.push(
            (() => {
              const result5 = []
              for (t in ats) {
                e = ats[t]
                result5.push(e)
              }
              return result5
            })()
          )
        }
        return result4
      })()
    } else if (options.people) {
      events = (() => {
        const result6 = []
        for (thth of Array.from(options.people)) {
          result6.push(
            (() => {
              const result7 = []
              for (at in person_action_store[namespace] != null
                ? person_action_store[namespace][thth]
                : undefined) {
                ats = (
                  person_action_store[namespace] != null
                    ? person_action_store[namespace][thth]
                    : undefined
                )[at]
                result7.push(
                  (() => {
                    const result8 = []
                    for (t in ats) {
                      e = ats[t]
                      result8.push(e)
                    }
                    return result8
                  })()
                )
              }
              return result7
            })()
          )
        }
        return result6
      })()
    } else if (options.things) {
      events = (() => {
        const result9 = []
        for (thth of Array.from(options.things)) {
          result9.push(
            (() => {
              const result10 = []
              for (at in thing_action_store[namespace] != null
                ? thing_action_store[namespace][thth]
                : undefined) {
                ats = (
                  thing_action_store[namespace] != null
                    ? thing_action_store[namespace][thth]
                    : undefined
                )[at]
                result10.push(
                  (() => {
                    const result11 = []
                    for (t in ats) {
                      e = ats[t]
                      result11.push(e)
                    }
                    return result11
                  })()
                )
              }
              return result10
            })()
          )
        }
        return result9
      })()
    } else {
      events = (() => {
        const result12 = []
        for (e of Array.from(event_store[namespace])) {
          result12.push(e)
        }
        return result12
      })()
    }

    events = _.flatten(events, true)
    events = (() => {
      const result13 = []
      for (e of Array.from(events)) {
        if (this._filter_event(e, options)) {
          result13.push(e)
        }
      }
      return result13
    })()
    events = _.sortBy(events, (x) => -x.created_at.getTime())

    events = events.slice(
      options.size * options.page,
      options.size * (options.page + 1)
    )
    return events
  }

  find_events(namespace, options) {
    if (options == null) {
      options = {}
    }
    return bb.try(() => this._find_events(namespace, options))
  }

  pre_compact() {
    return bb.try(() => true)
  }

  _delete_events(namespace, events) {
    event_store[namespace] = event_store[namespace].filter(
      (x) => !Array.from(events).includes(x)
    )
    return (() => {
      const result = []
      for (let e of Array.from(events)) {
        delete person_action_store[namespace][e.person][e.action][e.thing]
        result.push(
          delete thing_action_store[namespace][e.thing][e.action][e.person]
        )
      }
      return result
    })()
  }

  delete_events(namespace, options) {
    if (options == null) {
      options = {}
    }
    const events = this._find_events(namespace, {
      person: options.person,
      action: options.action,
      thing: options.thing,
    })
    this._delete_events(namespace, events)
    return bb.try(() => ({ deleted: events.length }))
  }

  compact_people(namespace, limit, actions) {
    //remove all
    let marked_for_deletion = []
    for (let person in person_action_store[namespace]) {
      const action_store = person_action_store[namespace][person]
      for (let action of Array.from(actions)) {
        const events = this._find_events(namespace, { person, action })
        if (events.length > limit) {
          marked_for_deletion = marked_for_deletion.concat(events.slice(limit))
        }
      }
    }

    this._delete_events(namespace, marked_for_deletion)
    return bb.try(() => true)
  }

  compact_things(namespace, limit, actions) {
    let marked_for_deletion = []
    for (let thing in thing_action_store[namespace]) {
      const action_store = thing_action_store[namespace][thing]
      for (let action of Array.from(actions)) {
        const events = this._find_events(namespace, { thing, action })
        if (events.length > limit) {
          marked_for_deletion = marked_for_deletion.concat(events.slice(limit))
        }
      }
    }

    this._delete_events(namespace, marked_for_deletion)
    return bb.try(() => true)
  }

  post_compact() {
    return bb.try(() => true)
  }
}

module.exports = BasicInMemory

function __guard__(value, transform) {
  return typeof value !== "undefined" && value !== null
    ? transform(value)
    : undefined
}
