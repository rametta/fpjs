import React, { Component } from 'react'
import styled from 'styled-components'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/xcode'
import 'brace/ext/language_tools'

const AceContainer = styled.div`
  display: flex;
  flex: 1;
  padding-bottom: 1em;
`

export class Editor extends Component {
  render() {
    return (
      <AceContainer className="u-full-width">
        <AceEditor
          ref={(c) => (this.reactAceEditor = c)}
          height="100%"
          width="100%"
          name="EDITOR"
          theme="xcode"
          mode="javascript"
          value={this.props.value}
          defaultValue={this.props.value}
          tabSize={2}
          fontSize={20}
          showPrintMargin={false}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          editorProps={{ $blockScrolling: Infinity }}
          onChange={this.props.onChange}
          commands={[
            {
              name: 'runScript',
              bindKey: { win: 'Ctrl-Enter', mac: 'Ctrl-Enter' },
              exec: () => this.props.exec()
            },
            {
              name: 'runScript2',
              bindKey: { mac: 'Command-Enter' },
              exec: () => this.props.exec()
            }
          ]}
        />
      </AceContainer>
    )
  }
}
