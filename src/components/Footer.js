import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-between;
  color: gray;
`

const Link = styled.a`
  text-decoration: none;
  color: gray;
`

const Gray = styled.span`
  color: gray;
`

export const Footer = ({ execute }) => (
  <FooterContainer className="container">
    <button className="btn" onClick={execute}>
      <span role="img" aria-label="fire emoji">
        🔥
      </span>{' '}
      Run <Gray>(Ctrl+Enter)</Gray>
    </button>
    <Link
      rel="noopener noreferrer"
      target="_blank"
      href="https://github.com/rametta/sanctuary-sandbox#how-to"
    >
      Help
    </Link>
  </FooterContainer>
)
