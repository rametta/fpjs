import React, { useReducer, useEffect, useRef } from 'react'
import styled from 'styled-components'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/dracula'
import 'brace/ext/language_tools'

import * as L from 'partial.lenses'
import * as R from 'ramda'
import * as P from 'pratica'
import * as _ from 'lodash'
import * as X from '@xstate/fsm'
import daggy from 'daggy'
import stringify from 'json-stringify'
import * as $ from 'sanctuary-def'
import { create, env } from 'sanctuary'

import { Header } from './Header'
import { Footer } from './Footer'
import { Result } from './Result'
import { Error } from './Error'
import { Sidebar } from './Sidebar'

const S = create({ checkTypes: true, env })

const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #282a36;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const AceContainer = styled.div`
  display: flex;
  flex: 1;
`

const Status = daggy.taggedSum('Status', {
  Success: ['result'],
  Error: ['msg'],
  Empty: [],
})

const canPush = script => {
  const { protocol, host, pathname } = window.location
  return P.nullable(window.history.pushState)
    .map(() => `${protocol}//${host}${pathname}?script=${script}`)
}

const valid = index => href => index > -1
  ? P.nullable(decodeURIComponent(href.substr(index + 8)))
  : P.Nothing

const isEmpty = code => code
  ? P.Ok(code)
  : P.Err('🥛 Empty: type something in...')

const isString = arg => typeof arg === 'string' || arg instanceof String

const isFunction = result => typeof result === 'function'
  ? P.Ok('Function: ' + result.toString())
  : P.Ok(result)

const safeStringify = result => isString(result)
  ? P.Ok(result)
  : P.encaseRes(() => stringify(result, null, 2))
     .mapErr(() => console.log(result) || 'Could not stringify result')

const hasResult = result => P.nullable(result).cata({
  Just: P.Ok,
  Nothing: () => P.Err(result === undefined ? 'undefined' : result === null ? 'null' : 'VOID')
})

const withContext = code => evalInContext.call({ S, L, R, P, X, $, _, daggy, code })

const tryEval = code => P.encaseRes(() => withContext(code))

const execute = code => isEmpty(code)
  .chain(tryEval)
  .chain(hasResult)
  .map(r => console.log(r) || r)
  .chain(isFunction)
  .chain(safeStringify)
  .mapErr(e => console.error(e) || e.toString())

function evalInContext() {
  // eslint-disable-next-line
  return eval(`
    const $ = this.$
    const S = this.S
    const L = this.L
    const R = this.R
    const P = this.P
    const X = this.X
    const _ = this._
    const daggy = this.daggy
    ${this.code}
  `)
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_CONTENT':
      return {
        ...state,
        content: payload,
      }
    case 'RUN':
      return {
        ...state,
        status: execute(state.content).cata({
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

const App = () => {
  const editorRef = useRef(null)

  const [{ content, status, sidebar }, dispatch] = useReducer(reducer, {
    content: 'S.compose (Math.sqrt) (S.add (1)) (8)',
    status: Status.Empty,
    sidebar: false
  })

  useEffect(() => {
    const { href } = window.location
    const index = href.indexOf('?script=')

    valid(index)(href).cata({
      Just: c => dispatch({ type: 'SET_CONTENT', payload: c }),
      Nothing: () => null
    })
  }, [])

  useEffect(() => {
    const script = encodeURIComponent(content)
    canPush(script).cata({
      Just: uri => window.history.pushState({ path: uri }, '', uri),
      Nothing: () => null
    })
  }, [content])

  useEffect(() => {
    editorRef.current && editorRef.current.editor.resize()
  }, [status])

  return (
    <AppContainer>
      <Header toggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} />
      {sidebar && <Sidebar toggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} />}
      <Content>
        <AceContainer className="u-full-width">
          <AceEditor
            ref={editorRef}
            height="100%"
            width="100%"
            theme="dracula"
            mode="javascript"
            value={content}
            defaultValue={content}
            tabSize={2}
            fontSize={20}
            showPrintMargin={false}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            editorProps={{ $blockScrolling: Infinity }}
            onChange={c => dispatch({ type: 'SET_CONTENT', payload: c })}
            commands={[
              {
                name: 'runScript',
                bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
                exec: () => dispatch({ type: 'RUN' })
              },
              {
                name: 'runScript2',
                bindKey: { mac: 'Command-Enter' },
                exec: () => dispatch({ type: 'RUN' })
              }
            ]}
          />
        </AceContainer>
        {status.cata({
          Success: (result) => <Result result={result} />,
          Error: (msg) => <Error msg={msg} />,
          Empty: () => null
        })}
        <Footer exec={() => dispatch({ type: 'RUN' })} />
      </Content>
    </AppContainer>
  )
}

export default App