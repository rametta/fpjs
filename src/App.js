import React, { Component } from 'react'
import { create, env } from 'sanctuary'
import './App.css'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/xcode'
import 'brace/ext/language_tools'
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
    this.refs.reactAceEditor.editor.resize()
  }

  render() {
    return (
      <div className="app-page">
        <header className="container header">
          <h1>
            <span role="img" aria-label="palm emoji">
              🌴
            </span>{' '}
            Sanctuary Sandbox
          </h1>
          <small>
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://github.com/sanctuary-js/sanctuary"
              className="link"
            >
              Docs
            </a>
          </small>
        </header>
        <div className="content">
          <div className="container ace-parent">
            <AceEditor
              ref="reactAceEditor"
              height="100%"
              width="100%"
              name="EDITOR"
              theme="xcode"
              mode="javascript"
              value={this.state.editorValue}
              defaultValue={this.state.editorValue}
              tabSize={2}
              fontSize={20}
              showPrintMargin={false}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              editorProps={{ $blockScrolling: Infinity }}
              onChange={this.update}
              commands={[
                {
                  name: 'runScript',
                  bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
                  exec: () => this.execute()
                }
              ]}
            />
          </div>
          {this.state.result ? (
            <div className="container result-box">
              <pre>
                <code className="overflow">{this.state.result}</code>
              </pre>
            </div>
          ) : null}

          {this.state.error ? (
            <div className="container result-box">
              <pre>
                <code className="red overflow">{this.state.error}</code>
              </pre>
            </div>
          ) : null}

          <footer className="container footer">
            <button className="btn" onClick={() => this.execute()}>
              Run (Ctrl+Enter)
            </button>
            <a
              href="https://github.com/rametta/sanctuary-sandbox"
              className="link"
            >
              Made by Jason
            </a>
          </footer>
        </div>
      </div>
    )
  }
}

export default App
