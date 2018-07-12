import React from 'react'
import styled from 'styled-components'

const Code = styled.code`
  overflow: auto;
`

const ResultContainer = styled.div`
  max-height: 200px;
  overflow: auto;
`

export const Result = ({ result }) => (
  <ResultContainer className="container">
    <pre>
      <Code>{result}</Code>
    </pre>
  </ResultContainer>
)
