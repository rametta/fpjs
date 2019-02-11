import * as redux from 'redux'
import * as L from 'partial.lenses'
import * as R from 'ramda'
import daggy from 'daggy'
import stringify from 'json-stringify'
import * as $ from 'sanctuary-def'
import { create, env } from 'sanctuary'
const S = create({ checkTypes: true, env })
const { unchecked } = S

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

// isEmpty :: String -> Either
const isEmpty = code => code
  ? unchecked.Right(code)
  : unchecked.Left('🥛 Empty: type something in...')

// safeStringify :: String -> Either
const safeStringify = result =>
  unchecked.encaseEither(() => '🚨 99 problems and your code is all of them')(r => stringify(r, null, 2))(result)

// isObject :: Result -> Either
const isObject = result => result !== null && typeof result === 'object'
  ? safeStringify(result)
  : unchecked.Right(result)

// isBool :: Result -> Either
const isBool = result => typeof result === 'boolean' 
  ? unchecked.Right(JSON.stringify(result))
  : unchecked.Right(result)

// isFunction :: Result -> Either
const isFunction = result => typeof result === 'function'
  ? unchecked.Right(result.toString())
  : unchecked.Right(result)

// isArray :: Result -> Either
const isArray = result => result.constructor === Array
  ? unchecked.Right(JSON.stringify(result, null, 2))
  : unchecked.Right(result)

// hasResult :: Result -> Either
const hasResult = result => result
  ? unchecked.Right(result)
  : unchecked.Left(result === undefined ? 'undefined' : result === null ? 'null' : 'VOID')

// withContext :: String -> Throwable String
const withContext = code => evalInContext.call({ S, L, R, $, daggy, redux, code })

// tryEval :: String -> Either
const tryEval = unchecked.encaseEither(e => console.error(e) || e.toString())(withContext)

const run = unchecked.compose(unchecked.pipeK([isEmpty, tryEval, isBool, hasResult, isArray, isFunction, isObject]))(unchecked.Right)

// evalInContext :: String
function evalInContext() {
  // eslint-disable-next-line
  return eval(`
    const $ = this.$
    const S = this.S
    const L = this.L
    const R = this.R
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
      return unchecked.either(error => ({ ...state, status: Status.Error(error) }))(result => ({
        ...state,
        status: Status.Success(result),
      }))(run(state.editor))
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebar: !state.sidebar
      }
    default:
      return state
  }
}
