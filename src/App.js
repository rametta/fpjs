import React, { Component } from 'react'
import { create, env } from 'sanctuary'
import './App.css'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/xcode'
import 'brace/ext/language_tools'

const S = create({ checkTypes: true, env })

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
    const uri = window.location.href
    const index = uri.indexOf('?script=')
    if (index > -1) {
      const script = decodeURIComponent(uri.substr(index + 8))
      if (script) {
        this.setState({ editorValue: script })
      }
    }
  }

  update(editorValue) {
    this.setState({ editorValue })
    const str = encodeURIComponent(editorValue)
    if (window.history.pushState) {
      const uri = `${window.location.protocol}//${window.location.host}${
        window.location.pathname
      }?script=${str}`
      window.history.pushState({ path: uri }, '', uri)
    }
  }

  execute() {
    if (!this.state.editorValue) {
      return
    }
    try {
      function evalInContext() {
        // eslint-disable-next-line
        return eval(`const S = this.S; ${this.code}`)
      }
      const result = evalInContext.call({ S, code: this.state.editorValue })
      if (result) {
        this.setState({ result: result.toString(), error: '' })
      }
    } catch (e) {
      this.setState({
        error: `Line ${e.lineNumber} - ${e.toString()}`,
        result: ''
      })
    }
    this.refs.reactAceEditor.editor.resize()
  }

  render() {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <header className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between'
            }}
          >
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
                href="https://sanctuary.js.org"
                style={{
                  textDecoration: 'none',
                  color: 'gray'
                }}
              >
                Docs
              </a>
            </small>
          </div>
        </header>
        <div
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <div
            className="container"
            style={{ display: 'flex', flex: 1, paddingBottom: '1em' }}
          >
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
            <div
              className="container"
              style={{ maxHeight: '200px', overflow: 'auto' }}
            >
              <pre>
                <code style={{ overflow: 'auto' }}>{this.state.result}</code>
              </pre>
            </div>
          ) : null}

          {this.state.error ? (
            <div
              className="container"
              style={{ maxHeight: '200px', overflow: 'auto' }}
            >
              <pre>
                <code style={{ color: '#f92c59', overflow: 'auto' }}>
                  {this.state.error}
                </code>
              </pre>
            </div>
          ) : null}

          <div
            className="container"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: 'gray'
            }}
          >
            <div>
              <button className="btn" onClick={() => this.execute()}>
                Run (Ctrl+Enter)
              </button>
            </div>
            <a
              href="https://github.com/rametta/sanctuary-sandbox"
              style={{
                textDecoration: 'none',
                color: 'gray'
              }}
            >
              Made by Jason
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default App
