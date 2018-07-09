import React, { Component } from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/xcode'
import 'brace/ext/language_tools'

export class Editor extends Component {
  render() {
    return (
      <div className="container ace-parent">
        <AceEditor
          ref={c => (this.reactAceEditor = c)}
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
              exec: () => this.props.exec(),
            },
            {
              name: 'runScript2',
              bindKey: { mac: 'Command-Enter' },
              exec: () => this.props.exec(),
            },
          ]}
        />
      </div>
    )
  }
}
