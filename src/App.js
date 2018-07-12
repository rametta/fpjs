import React, { Component } from 'react'
import { create, env } from 'sanctuary'
import styled from 'styled-components'
import * as L from 'partial.lenses'
import * as R from 'ramda'
import daggy from 'daggy'
import { Header, Footer, Result, Error, Editor } from './components'
const S = create({ checkTypes: true, env })
const { encaseEither, either, Left, Right, chain, I, pipeK, compose } = S

// isEmpty :: String -> Either
const isEmpty = (code) =>
  code ? Right(code) : Left('🥛 Empty: type something in...')

// isObject :: Result -> Either
const isObject = (result) =>
  result !== null && typeof result === 'object'
    ? Right(JSON.stringify(result, null, 2))
    : Right(result)

// isBool :: Result -> Either
const isBool = (result) =>
  typeof result === 'boolean' ? Right(JSON.stringify(result)) : Right(result)

// isFunction :: Result -> Either
const isFunction = (result) =>
  typeof result === 'function' ? Right(result.toString()) : Right(result)

// isArray :: Result -> Either
const isArray = (result) =>
  result.constructor === Array ? Right(JSON.stringify(result)) : Right(result)

// hasResult :: Result -> Either
const hasResult = (result) => (result ? Right(result) : Left('🌌 VOID'))

// canPush :: String -> Either
const canPush = (script) => {
  const { protocol, host, pathname } = window.location
  return window.history.pushState
    ? Right(`${protocol}//${host}${pathname}?script=${script}`)
    : Left(I)
}

// hasScript :: String -> Either
const hasScript = (script) => (script ? Right(script) : Left(I))

// valid :: Number -> String -> Either
const valid = (index) => (href) =>
  index > -1 ? Right(decodeURIComponent(href.substr(index + 8))) : Left(I)

// errMsg :: Error -> String
const errMsg = (e) =>
  e.lineNumber ? `Line ${e.lineNumber} - ${e.toString()}` : e.toString()

// withContext :: String -> Throwable String
const withContext = (code) => evalInContext.call({ S, L, R, daggy, code })

// tryEval :: String -> Either
const tryEval = encaseEither(errMsg)(withContext)

const run = compose(
  pipeK([isEmpty, tryEval, isBool, hasResult, isArray, isFunction, isObject])
)(Right)

// validateUri :: Number -> String -> Either
const validateUri = (index) => (href) => chain(hasScript)(valid(index)(href))

// evalInContext :: String
function evalInContext() {
  // eslint-disable-next-line
  return eval(`
    const S = this.S;
    const L = this.L;
    const R = this.R;
    const daggy = this.daggy;
    ${this.code}
  `)
}

const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorValue: 'S.compose (Math.sqrt) (S.add (1)) (8)',
      result: '',
      error: ''
    }
    this.update = this.update.bind(this)
  }

  componentDidMount() {
    const { href } = window.location
    const index = href.indexOf('?script=')
    either(I)((v) => this.setState({ editorValue: v }))(
      validateUri(index)(href)
    )
  }

  update(editorValue) {
    this.setState({ editorValue })
    const script = encodeURIComponent(editorValue)
    either(I)((uri) => window.history.pushState({ path: uri }, '', uri))(
      canPush(script)
    )
  }

  error(error) {
    this.setState({ result: '', error })
  }

  result(result) {
    this.setState({ result, error: '' })
  }

  execute() {
    const { editorValue } = this.state
    either((e) => this.error(e))((r) => this.result(r))(run(editorValue))
    setTimeout(() => this.editor.reactAceEditor.editor.resize(), 200)
  }

  render() {
    return (
      <AppContainer>
        <Header />
        <Content>
          <Editor
            ref={(c) => (this.editor = c)}
            exec={() => this.execute()}
            onChange={this.update}
            value={this.state.editorValue}
          />
          {this.state.result ? <Result result={this.state.result} /> : null}
          {this.state.error ? <Error error={this.state.error} /> : null}
          <Footer execute={() => this.execute()} />
        </Content>
      </AppContainer>
    )
  }
}

export default App
