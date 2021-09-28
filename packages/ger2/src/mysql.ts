// @ts-nocheck

import * as bb from "bluebird";
import * as _ from "lodash";

import * as moment from "moment";

const init_events_table = (knex, schema) =>
  knex.schema
    .createTable(`${schema}_events`, function (table) {
      table.increments()
      table.string("person").notNullable()
      table.string("action").notNullable()
      table.string("thing").notNullable()
      table.specificType("created_at", "timestamp(3)").notNullable()
      return table.specificType("expires_at", "timestamp(3)").nullable()
    })
    .then(function () {
      const i1 = knex.raw(
        `create index idx_person_created_at_${schema}_events on ${schema}_events (person, action, created_at DESC)`,
      )
      const i2 = knex.raw(
        `create index idx_thing_created_at_${schema}_events on ${schema}_events (thing, action, created_at DESC)`,
      )
      return bb.all([i1, i2])
    })

//CLASS ACTIONS
const drop_tables = function (knex, schema) {
  if (schema == null) {
    schema = "public"
  }
  return knex.schema.dropTableIfExists(`${schema}_events`)
}

const init_tables = function (knex, schema) {
  return init_events_table(knex, schema)
}

//The only stateful thing in this ESM is the UUID (schema), it should not be changed

export default class MysqlESM {
  //INSTANCE ACTIONS
  constructor(options) {
    if (options == null) {
      options = {}
    }
    this._knex = options.knex
  }

  destroy(namespace) {
    return drop_tables(this._knex, namespace)
  }

  initialize(namespace) {
    return this.exists(namespace).then((exists) => {
      if (!exists) {
        return init_tables(this._knex, namespace)
      }
    })
  }

  exists(namespace) {
    return this.list_namespaces().then((namespaces) => {
      return _.includes(namespaces, namespace)
    })
  }

  list_namespaces() {
    return this._knex
      .raw(
        "SELECT TABLE_NAME FROM information_schema.tables WHERE table_name LIKE '%_events'",
      )
      .then(function (res) {
        let ret = _.uniq(res[0].map((row) => row.TABLE_NAME))
        ret = ret.filter(Boolean).map((item) => item.replace("_events", ""))
        return ret
      })
  }

  add_events(events) {
    const namespaces = {}
    const now = moment().utc().format("YYYY-MM-DD HH:mm:ss.SSS")
    for (let e of Array.from(events)) {
      e.created_at =
        moment(e.created_at).utc().format("YYYY-MM-DD HH:mm:ss.SSS") || now
      if (e.expires_at) {
        e.expires_at = moment(e.expires_at)
          .utc()
          .format("YYYY-MM-DD HH:mm:ss.SSS")
      }
      if (!namespaces[e.namespace]) {
        namespaces[e.namespace] = []
      }
      namespaces[e.namespace].push(e)
      delete e.namespace
    }

    const promises = []
    for (let namespace in namespaces) {
      const es = namespaces[namespace]
      promises.push(this.add_events_to_namespace(namespace, es))
    }

    return bb.all(promises)
  }

  add_event(namespace, person, action, thing, dates) {
    if (dates == null) {
      dates = {}
    }
    return this.add_events([
      {
        namespace,
        person,
        action,
        thing,
        created_at: dates.created_at,
        expires_at: dates.expires_at,
      },
    ])
  }

  add_events_to_namespace(namespace, events) {
    return this._knex(`${namespace}_events`)
      .insert(events)
      .catch((error) => {
        if (error.errno === 1146) {
          throw new Errors.NamespaceDoestNotExist();
        }
      })
  }

  find_events(namespace, options) {
    if (options == null) {
      options = {}
    }
    options = _.defaults(options, {
      size: 50,
      page: 0,
      current_datetime: new Date(),
    })
    options.current_datetime = moment(options.current_datetime)
      .utc()
      .format("YYYY-MM-DD HH:mm:ss.SSS")
    if (options.time_until_expiry) {
      options.expires_after = moment(options.current_datetime)
        .add(options.time_until_expiry, "seconds")
        .format("YYYY-MM-DD HH:mm:ss.SSS")
    }

    let q = this._knex(`${namespace}_events`)
      .select("person", "action", "thing")
      .max("created_at as created_at")
      .max("expires_at as expires_at")
      .where("created_at", "<=", options.current_datetime)
      .orderBy("created_at", "desc")
      .groupBy(["person", "action", "thing"])
      .limit(options.size)
      .offset(options.size * options.page)

    if (options.expires_after) {
      q.where("expires_at", ">", options.expires_after)
    }

    if (options.person) {
      q = q.where({ person: options.person })
    }
    if (options.people) {
      q = q.whereIn("person", options.people)
    }

    if (options.action) {
      q = q.where({ action: options.action })
    }
    if (options.actions) {
      q = q.whereIn("action", options.actions)
    }

    if (options.thing) {
      q = q.where({ thing: options.thing })
    }
    if (options.things) {
      q = q.whereIn("thing", options.things)
    }

    return q.then((rows) => rows)
  }

  delete_events(namespace, options) {
    if (options == null) {
      options = {}
    }
    let q = this._knex(`${namespace}_events`)

    if (options.person) {
      q = q.where({ person: options.person })
    }
    if (options.people) {
      q = q.whereIn("person", options.people)
    }

    if (options.action) {
      q = q.where({ action: options.action })
    }
    if (options.actions) {
      q = q.whereIn("action", options.actions)
    }

    if (options.thing) {
      q = q.where({ thing: options.thing })
    }
    if (options.things) {
      q = q.whereIn("thing", options.things)
    }

    return q.del().then((delete_count) => ({
      deleted: delete_count,
    }))
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
    options.current_datetime = moment(options.current_datetime)
      .utc()
      .format("YYYY-MM-DD HH:mm:ss.SSS")
    options.expires_after = moment(options.current_datetime)
      .add(options.time_until_expiry, "seconds")
      .format("YYYY-MM-DD HH:mm:ss.SSS")

    const one_degree_away = this._one_degree_away(
      namespace,
      "thing",
      "person",
      thing,
      actions,
      options,
    ).orderByRaw("action_count DESC")

    return this._knex(one_degree_away.as("x"))
      .where("x.last_expires_at", ">", options.expires_after)
      .where("x.last_actioned_at", "<=", options.current_datetime)
      .orderByRaw("x.action_count DESC")
      .limit(options.neighbourhood_size)
      .then(function (rows) {
        for (let row of Array.from(rows)) {
          row.people = _.uniq(row.person.split(","))
        }
        return rows
      })
  }

  person_neighbourhood(namespace, person, actions, options) {
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
    options.current_datetime = moment(options.current_datetime)
      .utc()
      .format("YYYY-MM-DD HH:mm:ss.SSS")
    options.expires_after = moment(options.current_datetime)
      .add(options.time_until_expiry, "seconds")
      .format("YYYY-MM-DD HH:mm:ss.SSS")

    const one_degree_away = this._one_degree_away(
      namespace,
      "person",
      "thing",
      person,
      actions,
      options,
    ).orderByRaw("created_at_day DESC, action_count DESC")

    const unexpired_events = this._unexpired_events(namespace, actions, options)

    return this._knex(one_degree_away.as("x"))
      .whereExists(unexpired_events)
      .orderByRaw("x.created_at_day DESC, x.action_count DESC")
      .limit(options.neighbourhood_size)
      .then((rows) => Array.from(rows).map((row) => row.person))
  }

  _unexpired_events(namespace, actions, options) {
    return this._knex(`${namespace}_events`)
      .select("person")
      .whereRaw("expires_at IS NOT NULL")
      .where("expires_at", ">", options.expires_after)
      .where("created_at", "<=", options.current_datetime)
      .whereIn("action", actions)
      .whereRaw("person = x.person")
  }

  _one_degree_away(namespace, column1, column2, value, actions, options) {
    const query_hash = {}
    query_hash[column1] = value //e.g. {person: person} or {thing: thing}

    const recent_events = this._knex(`${namespace}_events`)
      .where(query_hash)
      .whereIn("action", actions)
      .orderByRaw("created_at DESC")
      .limit(options.neighbourhood_search_size)

    return this._knex(recent_events.as("e"))
      .innerJoin(`${namespace}_events as f`, function () {
        return this.on(`e.${column2}`, `f.${column2}`).on(
          `f.${column1}`,
          "!=",
          `e.${column1}`,
        )
      })
      .where(`e.${column1}`, value)
      .whereIn("f.action", actions)
      .where("f.created_at", "<=", options.current_datetime)
      .where("e.created_at", "<=", options.current_datetime)
      .select(
        this._knex.raw(
          `f.${column1}, MAX(f.created_at) as last_actioned_at, MAX(f.expires_at) as last_expires_at, group_concat(distinct f.${column2}) as ${column2}, DATE(max(e.created_at)) as created_at_day, count(f.${column1}) as action_count`,
        ),
      )
      .groupBy(`f.${column1}`)
  }

  //#################################
  //###  END OF NEIGHBOURHOOD  ######
  //#################################

  filter_things_by_previous_actions(namespace, person, things, actions) {
    if (!actions || actions.length === 0 || things.length === 0) {
      return bb.try(() => things)
    }

    const bindings = { person }
    let action_values = []
    for (let ai = 0; ai < actions.length; ai++) {
      const a = actions[ai]
      const akey = `action_${ai}`
      bindings[akey] = a
      action_values.push(` :${akey} `)
    }

    action_values = action_values.join(",")

    let thing_values = []
    for (let ti = 0; ti < things.length; ti++) {
      const t = things[ti]
      const tkey = `thing_${ti}`
      bindings[tkey] = t
      thing_values.push(`select :${tkey} as tthing`)
    }

    thing_values = thing_values.join(" union all ")

    const things_rows = `(${thing_values}) AS t`

    const filter_things_sql = this._knex(`${namespace}_events`)
      .select("thing")
      .whereRaw("person = :person")
      .whereRaw(`action in (${action_values})`)
      .whereRaw("thing = t.tthing")
      .toSQL()

    const query = `select tthing from ${things_rows} where not exists (${filter_things_sql.sql})`

    return this._knex
      .raw(query, bindings)
      .then((rows) => Array.from(rows[0]).map((r) => r.tthing))
  }

  //#############################
  //#### RECENT EVENTS  #########
  //#############################

  _recent_events(namespace, column1, actions, values, options) {
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
    options.current_datetime = moment(options.current_datetime)
      .utc()
      .format("YYYY-MM-DD HH:mm:ss.SSS")

    const expires_after = moment(options.current_datetime)
      .add(options.time_until_expiry, "seconds")
      .format()

    const bindings = { expires_after, now: options.current_datetime }

    let action_values = []
    for (let ai = 0; ai < actions.length; ai++) {
      const a = actions[ai]
      const akey = `action_${ai}`
      bindings[akey] = a
      action_values.push(` :${akey} `)
    }

    action_values = action_values.join(",")
    const ql = []
    for (let i = 0; i < values.length; i++) {
      const v = values[i]
      const key = `value_${i}`
      bindings[key] = v
      ql.push(`(select person, thing, MAX(created_at) as last_actioned_at, MAX(expires_at) as last_expires_at from ${namespace}_events \
where created_at <= :now and action in (${action_values}) and ${column1} = :${key} and (expires_at > :expires_after ) group by person, thing order by last_actioned_at DESC limit ${options.recommendations_per_neighbour})`)
    }

    let query = ql.join(" union all ")
    if (ql.length > 1) {
      query += " order by last_actioned_at DESC"
    }

    return this._knex.raw(query, bindings).then((ret) => ret[0])
  }

  recent_recommendations_by_people(namespace, actions, people, options) {
    return this._recent_events(namespace, "person", actions, people, options)
  }

  _history(namespace, column1, column2, value, al_values, limit) {
    return this._knex(`${namespace}_events`)
      .select(column2, "action")
      .max("created_at as created_at")
      .groupBy(column2, "action")
      .whereRaw(`action in ( ${al_values} )`)
      .orderByRaw("max(created_at) DESC")
      .whereRaw("created_at <= :now")
      .whereRaw(`${column1} = ${value}`)
      .limit(limit)
  }

  cosine_query(namespace, s1, s2) {
    const numerator_1 = `(select (tbl1.weight * tbl2.weight) as weight from (${s1}) tbl1 join (${s2}) tbl2 on tbl1.value = tbl2.value)`
    const numerator_2 = `(select SUM(n1.weight) from (${numerator_1}) as n1)`

    const denominator_1 = `(select SUM(power(s1.weight, 2.0)) from (${s1}) as s1)`
    const denominator_2 = `(select SUM(power(s2.weight, 2.0)) from (${s2}) as s2)`
    // numerator_2
    // numberator = "(#{numerator_1} * #{numerator_2})"
    // # case statement is needed for divide by zero problem

    // denominator = "( SQRT(#{denominator_1}) *  )"
    // if null return 0
    return `COALESCE( (${numerator_2} / (SQRT(${denominator_1}) * SQRT(${denominator_2})) ), 0)`
  }

  cosine_distance(
    namespace,
    column1,
    column2,
    limit,
    a_values,
    al_values,
    vkey,
  ) {
    const s1q = this._history(
      namespace,
      column1,
      column2,
      ":value",
      al_values,
      limit,
    ).toString()
    const s2q = this._history(
      namespace,
      column1,
      column2,
      `:${vkey}`,
      al_values,
      limit,
    ).toString()

    //decay is weight * days
    const weighted_actions = `select a.weight * power( :event_decay_rate, - datediff( :now , x.created_at )) from (${a_values}) AS a where x.action = a.action`

    const s1_weighted = `select x.${column2}, (${weighted_actions}) as weight from (${s1q}) as x`
    const s2_weighted = `select x.${column2}, (${weighted_actions}) as weight from (${s2q}) as x`

    // There are two options here, either select max value, or select most recent.
    // This might be a configuration in the future
    // e.g. if a person purchases a thing, then views it the most recent action is wrong
    // e.g. if a person gives something a 5 star rating then changes it to 1 star, the max value is wrong

    const s1 = `select ws.${column2} as value, max(ws.weight) as weight from (${s1_weighted}) as ws where ws.weight != 0 group by ws.${column2}`
    const s2 = `select ws.${column2} as value, max(ws.weight) as weight from (${s2_weighted}) as ws where ws.weight != 0 group by ws.${column2}`

    return `${this.cosine_query(namespace, s1, s2)} as cosine_distance`
  }

  get_cosine_distances(
    namespace,
    column1,
    column2,
    value,
    values,
    actions,
    limit,
    event_decay_rate,
    now,
  ) {
    let action, cosine_distance, query, weight
    if (values.length === 0) {
      return bb.try(() => [])
    }
    const bindings = { value, now, event_decay_rate }

    const action_list = []
    for (action in actions) {
      //making it easier to work with actions
      weight = actions[action]
      action_list.push({ action, weight })
    }

    let a_values = []
    let al_values = []
    for (let ai = 0; ai < action_list.length; ai++) {
      const a = action_list[ai]
      const akey = `action_${ai}`
      const wkey = `weight_${ai}`
      bindings[akey] = a.action
      bindings[wkey] = a.weight
      a_values.push(`select :${akey} as action, :${wkey} as weight`)
      al_values.push(`:${akey}`)
    }

    a_values = a_values.join(" union all ")
    al_values = al_values.join(" , ")

    const v_values = []

    for (let vi = 0; vi < values.length; vi++) {
      const v = values[vi]
      const vkey = `value_${vi}`
      cosine_distance = this.cosine_distance(
        namespace,
        column1,
        column2,
        limit,
        a_values,
        al_values,
        vkey,
      )
      query = `select :${vkey} as cvalue, ${cosine_distance}`
      bindings[vkey] = v
      v_values.push(query)
    }

    query = v_values.join(" union all ")

    return this._knex.raw(query, bindings).then(function (rows) {
      const similarities = {}
      for (let row of Array.from(rows[0])) {
        similarities[row.cvalue] = row.cosine_distance
      }

      return similarities
    })
  }

  _similarities(namespace, column1, column2, value, values, actions, options) {
    if (options == null) {
      options = {}
    }
    if (!actions || actions.length === 0 || values.length === 0) {
      return bb.try(() => ({}))
    }
    options = _.defaults(options, {
      similarity_search_size: 500,
      event_decay_rate: 1,
      current_datetime: new Date(),
    })
    options.current_datetime = moment(options.current_datetime)
      .utc()
      .format("YYYY-MM-DD HH:mm:ss.SSS")
    //TODO history search size should be more [similarity history search size]
    return this.get_cosine_distances(
      namespace,
      column1,
      column2,
      value,
      values,
      actions,
      options.similarity_search_size,
      options.event_decay_rate,
      options.current_datetime,
    )
  }

  calculate_similarities_from_thing(
    namespace,
    thing,
    things,
    actions,
    options,
  ) {
    if (options == null) {
      options = {}
    }
    return this._similarities(
      namespace,
      "thing",
      "person",
      thing,
      things,
      actions,
      options,
    )
  }

  calculate_similarities_from_person(
    namespace,
    person,
    people,
    actions,
    options,
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
      options,
    )
  }

  count_events(namespace) {
    return this._knex(`${namespace}_events`)
      .count()
      .then((count) => parseInt(count[0]["count(*)"]))
  }

  estimate_event_count(namespace) {
    return this._knex
      .raw(
        `SELECT table_rows as estimate
         from information_schema.tables
         WHERE table_name = 'events' and table_schema = :ns`,
        { ns: `${namespace}` },
      )
      .then(function (ret) {
        if (ret[0].length === 0) {
          return 0
        }
        return parseInt(ret[0][0].estimate)
      })
  }

  // DATABASE CLEANING METHODS

  pre_compact(namespace) {
    return this.analyze(namespace)
  }

  post_compact(namespace) {
    return this.analyze(namespace)
  }

  analyze(namespace) {
    return this._knex.raw(`ANALYZE TABLE ${namespace}_events`)
  }

  get_active_things(namespace) {
    return this._knex(`${namespace}_events`)
      .select("thing")
      .select(this._knex.raw("count(*) as thing_count"))
      .groupBy("thing")
      .orderByRaw("thing_count DESC")
      .limit(100)
      .then(function (rows) {
        rows = rows.map((row) => row.thing)
        return rows
      })
  }

  get_active_people(namespace) {
    return this._knex(`${namespace}_events`)
      .select("person")
      .select(this._knex.raw("count(*) as person_count"))
      .groupBy("person")
      .orderByRaw("person_count DESC")
      .limit(100)
      .then(function (rows) {
        rows = rows.map((row) => row.person)
        return rows
      })
  }

  compact_people(namespace, compact_database_person_action_limit, actions) {
    return this.get_active_people(namespace).then((people) => {
      return this.truncate_people_per_action(
        namespace,
        people,
        compact_database_person_action_limit,
        actions,
      )
    })
  }

  compact_things(namespace, compact_database_thing_action_limit, actions) {
    return this.get_active_things(namespace).then((things) => {
      return this.truncate_things_per_action(
        namespace,
        things,
        compact_database_thing_action_limit,
        actions,
      )
    })
  }

  truncate_things_per_action(namespace, things, trunc_size, actions) {
    //TODO do the same thing for things
    if (things.length === 0) {
      return bb.try(() => [])
    }

    //cut each action down to size
    let promise = bb.try(function () {})
    for (let thing of Array.from(things)) {
      for (let action of Array.from(actions)) {
        ;((thing, action) => {
          return (promise = promise.then(() =>
            this.truncate_thing_actions(namespace, thing, trunc_size, action),
          ))
        })(thing, action)
      }
    }

    return promise
  }

  truncate_thing_actions(namespace, thing, trunc_size, action) {
    return this._knex(`${namespace}_events`)
      .select("id")
      .where("action", action)
      .where("thing", thing)
      .orderBy("created_at", "desc")
      .offset(trunc_size)
      .then(function (rows) {
        const ids = rows.map((row) => row.id)
        return this._knex(`${namespace}_events`).whereIn("id", ids).del()
      })
  }

  truncate_people_per_action(namespace, people, trunc_size, actions) {
    //TODO do the same thing for things
    if (people.length === 0) {
      return bb.try(() => [])
    }

    //cut each action down to size
    let promise = bb.try(function () {})
    for (let person of Array.from(people)) {
      for (let action of Array.from(actions)) {
        ;((person, action) => {
          return (promise = promise.then(() =>
            this.truncate_person_actions(namespace, person, trunc_size, action),
          ))
        })(person, action)
      }
    }

    return promise
  }

  truncate_person_actions(namespace, person, trunc_size, action) {
    return this._knex(`${namespace}_events`)
      .select("id")
      .where("action", action)
      .where("person", person)
      .orderBy("created_at", "desc")
      .offset(trunc_size)
      .then(function (rows) {
        const ids = rows.map((row) => row.id)
        return this._knex(`${namespace}_events`).whereIn("id", ids).del()
      })
  }

  remove_events_till_size(namespace, number_of_events) {
    //TODO move too offset method
    //removes old events till there is only number_of_events left
    const query = `delete from ${namespace}_events where id not in (select id from ${namespace}_events order by created_at desc limit ${number_of_events})`
    return this._knex.raw(query)
  }
}
