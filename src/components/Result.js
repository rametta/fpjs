import React from 'react'
import styled from 'styled-components'

const ResultContainer = styled.div`
  max-height: 200px;
  overflow: auto;
  margin-bottom: 1em;
  background: #d8ffed;
  border: 1px solid #8effe0;
`

const Pre = styled.pre`
  margin-top: 0;
  margin-bottom: 0;
`

const Code = styled.code`
  overflow: auto;
  background: #d8ffed;
  border: 1px solid transparent;
  border-radius: 0;
`

export const Result = ({ result }) => (
  <ResultContainer className="u-full-width">
    <Pre>
      <Code>{result}</Code>
    </Pre>
  </ResultContainer>
)
