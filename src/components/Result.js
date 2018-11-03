import React from 'react'
import styled from 'styled-components'

const ResultContainer = styled.div`
  max-height: 200px;
  overflow: auto;
  background: #98a5f2;
  border: none;
`

const Pre = styled.pre`
  margin-top: 0;
  margin-bottom: 0;
`

const Code = styled.code`
  overflow: auto;
  background: #98a5f2;
  border: none;
  border-radius: 0;
`

export const Result = ({ result }) => (
  <ResultContainer className="u-full-width">
    <Pre>
      <Code>{result}</Code>
    </Pre>
  </ResultContainer>
)
