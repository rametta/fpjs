import React, { Component } from 'react'
import { connect } from 'react-redux'
import { create, env } from 'sanctuary'
import styled from 'styled-components'

import { Header } from './Header'
import { Footer } from './Footer'
import { Result } from './Result'
import { Error } from './Error'
import { Editor } from './Editor'

import { setEditor, execute } from './../app.redux'
const S = create({ checkTypes: true, env })
const { either, Left, Right, chain, I } = S

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
    either(I)((v) => this.props.setEditor(v))(validateUri(index)(href))
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
    const { status, editor } = this.props
    return (
      <AppContainer>
        <Header />
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
          <Footer />
        </Content>
      </AppContainer>
    )
  }
}

export default connect(
  ({ editor, status }) => ({ editor, status }),
  { setEditor, execute }
)(App)
