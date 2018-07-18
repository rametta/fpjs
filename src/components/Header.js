import React from 'react'
import styled from 'styled-components'

const Flex = styled.div`
  display: flex;
`

const Link = styled.a`
  margin-right: 7px;
  text-decoration: none;
  color: gray;
  :hover {
    animation: zomg 3s infinite;
  }
`

const Palm = styled.h1`
  margin-right: 0.5em;
`

const Title = styled.h2`
  margin-bottom: 0;
`

const HeaderContainer = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`

const Links = styled.small`
  display: flex;
  flex-wrap: wrap;
`

export const Header = () => (
  <HeaderContainer className="container">
    <Flex>
      <Palm>
        <span role="img" aria-label="palm emoji">
          🌴
        </span>
      </Palm>
      <div>
        <Title>Sanctuary Sandbox</Title>
        <Links>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://sanctuary.js.org"
          >
            Sanctuary
          </Link>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/fantasyland/daggy#daggy"
          >
            Daggy
          </Link>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/calmm-js/partial.lenses#---partial-lenses----"
          >
            Partial.Lenses
          </Link>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://ramdajs.com/docs/"
          >
            Ramda
          </Link>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/rametta/sanctuary-sandbox"
          >
            Rametta
          </Link>
        </Links>
      </div>
    </Flex>

    <small />
  </HeaderContainer>
)
