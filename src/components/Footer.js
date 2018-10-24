import React from 'react'
import styled from 'styled-components'

const FooterWrapper = styled.footer`
  display: flex;
  justify-content: space-between;
  color: gray;
`

const Gray = styled.span`
  color: gray;
`

const Button = styled.button`
  margin-left: 1em;
  overflow: hidden;
`

export const Footer = ({ exec }) => (
  <FooterWrapper className="u-full-width">
    <Button className="btn" onClick={exec} type="button">
      <span role="img" aria-label="fire emoji">
        🔥
      </span>{' '}
      Run <Gray>(Ctrl+Enter)</Gray>
    </Button>
  </FooterWrapper>
)
