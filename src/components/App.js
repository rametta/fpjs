import React, { Component } from 'react'
import { connect } from 'react-redux'
import { either, Left, Right, chain, I } from 'sanctuary'
import styled from 'styled-components'

import { Header } from './Header'
import { Footer } from './Footer'
import { Result } from './Result'
import { Error } from './Error'
import { Editor } from './Editor'
import { Sidebar } from './Sidebar'

import { setEditor, execute, toggleSidebar } from './../app.redux'

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
    either(I)(this.props.setEditor)(validateUri(index)(href))
  }

  update(editorValue) {
    this.props.setEditor(editorValue)
    const script = encodeURIComponent(editorValue)
    either(I)((uri) => window.history.pushState({ path: uri }, '', uri))(
      canPush(script)
    )
  }

  execute() {
    this.props.execute()
    setTimeout(() => this.editor.reactAceEditor.editor.resize(), 200)
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
