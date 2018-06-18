import React, { Component } from 'react'
import { create, env } from 'sanctuary'
import './App.css'
import { Header, Footer, Result, Error, Editor } from './components'
const S = create({ checkTypes: true, env })
const { encaseEither, either, Left, Right, chain, I } = S

// shouldExecute :: String -> Either
const shouldExecute = (code) =>
  code ? Right(code) : Left('🥛 Empty: type something in...')

// hasResult :: Result -> Either
const hasResult = (result) =>
  result ? Right(result.toString()) : Left('💥 Try again...')

// tryEval :: String -> Either
const tryEval = (code) => encaseEither(errMsg)(withContext)(code)

// validateResult :: String -> Either
const validateResult = (code) => chain(hasResult)(tryEval(code))

// validateCode :: String -> Either
const validateCode = (code) => chain(validateResult)(shouldExecute(code))

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

// validateUri :: Number -> String -> Either
const validateUri = (index) => (href) => chain(hasScript)(valid(index)(href))

// withContext :: String -> Throwable String
const withContext = (code) => evalInContext.call({ S, code })

// evalInContext :: String
function evalInContext() {
  // eslint-disable-next-line
  return eval(`const S = this.S; ${this.code}`)
}

// errMsg :: Error -> String
const errMsg = (e) =>
  e.lineNumber ? `Line ${e.lineNumber} - ${e.toString()}` : e.toString()

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
    either((e) => this.error(e))((r) => this.result(r))(
      validateCode(editorValue)
    )
    this.refs.editor.refs.reactAceEditor.editor.resize()
  }

  render() {
    return (
      <div className="app-page">
        <Header />
        <div className="content">
          <Editor
            ref="editor"
            exec={() => this.execute()}
            onChange={this.update}
            value={this.state.editorValue}
          />
          {this.state.result ? <Result result={this.state.result} /> : null}
          {this.state.error ? <Error error={this.state.error} /> : null}
          <Footer execute={() => this.execute()} />
        </div>
      </div>
    )
  }
}

export default App
