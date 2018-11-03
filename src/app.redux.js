import * as redux from 'redux'
import * as L from 'partial.lenses'
import * as R from 'ramda'
import daggy from 'daggy'
import stringify from 'json-stringify'
import * as $ from 'sanctuary-def'
import { create, env } from 'sanctuary'
const S = create({ checkTypes: true, env })
const { encaseEither, either, Left, Right, pipeK, compose } = S

const Status = daggy.taggedSum('Status', {
  Success: ['result'],
  Error: ['msg'],
  Empty: [],
})

const types = {
  SET_EDITOR: 'SET_EDITOR',
  EXECUTE: 'EXECUTE',
}

const initial = {
  editor: `S.compose (Math.sqrt) (S.add (1)) (8)`,
  status: Status.Empty,
}

// setEditor :: Payload -> Action
export const setEditor = payload => ({ type: types.SET_EDITOR, payload })

// execute :: Action
export const execute = () => ({ type: types.EXECUTE })

// isEmpty :: String -> Either
const isEmpty = code => code
  ? Right(code)
  : Left('🥛 Empty: type something in...')

// safeStringify :: String -> Either
const safeStringify = result =>
  encaseEither(() => '🚨 99 problems and your code is all of them')(r => stringify(r, null, 2))(result)

// isObject :: Result -> Either
const isObject = result => result !== null && typeof result === 'object'
  ? safeStringify(result)
  : Right(result)

// isBool :: Result -> Either
const isBool = result => typeof result === 'boolean' 
  ? Right(JSON.stringify(result))
  : Right(result)

// isFunction :: Result -> Either
const isFunction = result => typeof result === 'function'
  ? Right(result.toString())
  : Right(result)

// isArray :: Result -> Either
const isArray = result => result.constructor === Array
  ? Right(JSON.stringify(result, null, 2))
  : Right(result)

// hasResult :: Result -> Either
const hasResult = result => result
  ? Right(result)
  : Left(result === undefined ? 'undefined' : result === null ? 'null' : 'VOID')

// withContext :: String -> Throwable String
const withContext = code => evalInContext.call({ S, L, R, $, daggy, redux, code })

// tryEval :: String -> Either
const tryEval = encaseEither(e => e.toString())(withContext)

// log :: Result -> Either
const log = result => console.info(result) || Right(result)

const run = compose(pipeK([isEmpty, tryEval, log, isBool, hasResult, isArray, isFunction, isObject]))(Right)

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
    case types.SET_EDITOR:
      return {
        ...state,
        editor: payload,
      }
    case types.EXECUTE:
      return either(error => ({ ...state, status: Status.Error(error) }))(result => ({
        ...state,
        status: Status.Success(result),
      }))(run(state.editor))
    default:
      return state
  }
}
