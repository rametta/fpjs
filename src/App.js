import React, { Component } from 'react'
import S from 'sanctuary'
import './App.css'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/xcode'
import 'brace/ext/language_tools'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editorValue: 'S.compose (Math.sqrt) (S.add (1)) (8)',
      result: '',
      error: ''
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
      this.setState({ result: result.toString(), error: '' })
    } catch (e) {
      console.error(e)
      this.setState({
        error: `Line ${e.lineNumber} - ${e.toString()}`,
        result: ''
      })
    }
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
            style={{ flexGrow: 1, paddingBottom: '1em' }}
          >
            <AceEditor
              name="EDITOR"
              theme="xcode"
              height="100%"
              width="100%"
              mode="javascript"
              value={this.state.editorValue}
              defaultValue={this.state.editorValue}
              tabSize={2}
              fontSize={20}
              showPrintMargin={false}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              editorProps={{ $blockScrolling: true }}
              onChange={(value) => this.setState({ editorValue: value })}
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
            <div className="container">
              <pre>
                <code style={{ overflow: 'auto' }}>{this.state.result}</code>
              </pre>
            </div>
          ) : null}

          {this.state.error ? (
            <div className="container">
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
              <kbd>CTRL+ENTER</kbd> to run
            </div>
            <a
              href="https://github.com/rametta"
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
