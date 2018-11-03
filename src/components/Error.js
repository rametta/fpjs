import React from 'react'
import styled from 'styled-components'

const ErrorContainer = styled.div`
  max-height: 200px;
  overflow: auto;
  border: none;
  background: #f44242;
`

const Pre = styled.pre`
  margin-top: 0;
  margin-bottom: 0;
`

const Code = styled.code`
  color: #f92c59;
  overflow: auto;
  border: none;
  background: #f44242;
  color: white;
  border-radius: 0;
`

export const Error = ({ msg }) => (
  <ErrorContainer className="u-full-width">
    <Pre>
      <Code>{msg}</Code>
    </Pre>
  </ErrorContainer>
)
