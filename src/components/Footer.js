import React from 'react'
import styled, { keyframes } from 'styled-components'

const FooterWrapper = styled.footer`
  display: flex;
  justify-content: space-between;
  color: gray;
`

const Gray = styled.span`
  color: #f2f2f2;
`

const Button = styled.button`
  margin-left: 1em;
  margin-top: 1em;
  overflow: hidden;
  background: #98a5f2;
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
