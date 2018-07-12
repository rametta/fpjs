import React from 'react'
import styled from 'styled-components'

const Code = styled.code`
  color: #f92c59;
  overflow: auto;
`

const ErrorContainer = styled.div`
  max-height: 200px;
  overflow: auto;
`

export const Error = ({ error }) => (
  <ErrorContainer className="container">
    <pre>
      <Code>{error}</Code>
    </pre>
  </ErrorContainer>
)
