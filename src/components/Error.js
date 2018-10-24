import React from 'react'
import styled from 'styled-components'

const ErrorContainer = styled.div`
  max-height: 200px;
  overflow: auto;
  margin-bottom: 1em;
  border: 1px solid #ff8e8e;
  background: #ffd8d8;
`

const Pre = styled.pre`
  margin-top: 0;
  margin-bottom: 0;
`

const Code = styled.code`
  color: #f92c59;
  overflow: auto;
  border: 1px solid transparent;
  background: #ffd8d8;
  border-radius: 0;
`

export const Error = ({ msg }) => (
  <ErrorContainer className="u-full-width">
    <Pre>
      <Code>{msg}</Code>
    </Pre>
  </ErrorContainer>
)
