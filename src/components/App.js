import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Maybe, Nothing } from 'pratica'
import styled from 'styled-components'

import { Header } from './Header'
import { Footer } from './Footer'
import { Result } from './Result'
import { Error } from './Error'
import { Editor } from './Editor'
import { Sidebar } from './Sidebar'

import { setEditor, execute, toggleSidebar } from './../app.redux'

// canPush :: String -> Maybe
const canPush = (script) => {
  const { protocol, host, pathname } = window.location
  return Maybe(window.history.pushState)
    .map(() => `${protocol}//${host}${pathname}?script=${script}`)
}

// valid :: Number -> String -> Maybe
const valid = index => href => index > -1
  ? Maybe(decodeURIComponent(href.substr(index + 8)))
  : Nothing

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

class App extends Component {
  componentDidMount() {
    const { href } = window.location
    const index = href.indexOf('?script=')
    valid(index)(href).cata({
      Just: this.props.setEditor,
      Nothing: () => null
    })
    this.resize()
  }

  update(editorValue) {
    this.props.setEditor(editorValue)
    const script = encodeURIComponent(editorValue)
    canPush(script).cata({
      Just: uri => window.history.pushState({ path: uri }, '', uri),
      Nothing: () => null
    })
  }

  execute() {
    this.props.execute()
    this.resize()
  }

  resize() {
    setTimeout(() => this.editor.reactAceEditor.editor.resize(), 100)
  }

  render() {
    const { status, editor, sidebar, toggleSidebar } = this.props
    return (
      <AppContainer>
        <Header toggleSidebar={toggleSidebar} />
        {sidebar ? <Sidebar toggleSidebar={toggleSidebar} /> : null}
        <Content>
          <Editor
            ref={(c) => (this.editor = c)}
            exec={() => this.execute()}
            onChange={this.update.bind(this)}
            value={editor}
          />
          {status.cata({
            Success: (result) => <Result result={result} />,
            Error: (msg) => <Error msg={msg} />,
            Empty: () => null
          })}
          <Footer exec={this.execute.bind(this)} />
        </Content>
      </AppContainer>
    )
  }
}

export default connect(
  ({ editor, status, sidebar }) => ({ editor, status, sidebar }),
  { setEditor, execute, toggleSidebar }
)(App)
