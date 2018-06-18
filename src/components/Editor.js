import React, { Component } from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/xcode'
import 'brace/ext/language_tools'

export class Editor extends Component {
  constructor(props) {
    super(props)
    this.execute = this.execute.bind(this)
  }

  execute() {
    this.props.exec()
    this.refs.reactAceEditor.editor.resize()
  }

  render() {
    return (
      <div className="container ace-parent">
        <AceEditor
          ref="reactAceEditor"
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
              exec: () => this.execute()
            }
          ]}
        />
      </div>
    )
  }
}
