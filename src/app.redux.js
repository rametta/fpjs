import * as redux from 'redux'
import * as L from 'partial.lenses'
import * as R from 'ramda'
import * as P from 'pratica'
import daggy from 'daggy'
import stringify from 'json-stringify'
import * as $ from 'sanctuary-def'
import { create, env } from 'sanctuary'
const S = create({ checkTypes: true, env })

const Status = daggy.taggedSum('Status', {
  Success: ['result'],
  Error: ['msg'],
  Empty: [],
})

const initial = {
  editor: `S.compose (Math.sqrt) (S.add (1)) (8)`,
  status: Status.Empty,
  sidebar: false
}

// actions
export const setEditor = payload => ({ type: 'SET_EDITOR', payload })
export const execute = () => ({ type: 'EXECUTE' })
export const toggleSidebar = () => ({ type: 'TOGGLE_SIDEBAR' })

// isEmpty :: String -> Result
const isEmpty = code => code
  ? P.Ok(code)
  : P.Err('🥛 Empty: type something in...')

// isString :: Any -> Boolean
const isString = arg => typeof arg === 'string' || arg instanceof String

// isFunction :: String -> Result
const isFunction = result => typeof result === 'function'
  ? P.Ok('Function: ' + result.toString())
  : P.Ok(result)

// safeStringify :: String -> Result
const safeStringify = result => isString(result)
  ? P.Ok(result)
  : P.encaseRes(() => stringify(result, null, 2))
     .mapErr(() => console.log(result) || 'Could not stringify result')

// hasResult :: String -> Result
const hasResult = result => P.Maybe(result).cata({
  Just: P.Ok,
  Nothing: () => P.Err(result === undefined ? 'undefined' : result === null ? 'null' : 'VOID')
})

// withContext :: String -> Throwable String
const withContext = code => evalInContext.call({ S, L, R, P, $, daggy, redux, code })

// tryEval :: String -> Result
const tryEval = code => P.encaseRes(() => withContext(code))

// run :: String -> Result
const run = code => isEmpty(code)
  .chain(tryEval)
  .chain(hasResult)
  .map(r => console.log(r) || r)
  .chain(isFunction)
  .chain(safeStringify)
  .mapErr(e => console.error(e) || e.toString())

// evalInContext :: String
function evalInContext() {
  // eslint-disable-next-line
  return eval(`
    const $ = this.$
    const S = this.S
    const L = this.L
    const R = this.R
    const P = this.P
    const redux = this.redux
    const daggy = this.daggy
    ${this.code}
  `)
}

export const reducer = (state = initial, { type, payload }) => {
  switch (type) {
    case 'SET_EDITOR':
      return {
        ...state,
        editor: payload,
      }
    case 'EXECUTE':

      return {
        ...state,
        status: run(state.editor).cata({
          Ok: res => Status.Success(res),
          Err: msg => Status.Error(msg)
        })
      }
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebar: !state.sidebar
      }
    default:
      return state
  }
}
