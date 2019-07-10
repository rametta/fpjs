import React from 'react'
import styled from 'styled-components'

const Flex = styled.div`
  display: flex;
  @media (max-width: 700px) {
    display: none;
  }
`

const Link = styled.a`
  margin-right: 7px;
  text-decoration: none;
  color: #6272a4;
  :hover {
    animation: zomg 3s infinite;
  }
`

const Palm = styled.h1`
  margin-right: 0.25em;
  margin-bottom: 0;
`

const Title = styled.h2`
  color: #d8e2ff;
  margin-bottom: 0;
`

const HeaderContainer = styled.header`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-bottom: 1em;
  @media (max-width: 700px) {
    padding-bottom: 0;
  }
`

const Links = styled.small`
  display: flex;
  flex-wrap: wrap;
`

const ExampleBtn = styled.button`
  margin-left: 1em;
  margin-top: 5px;
  background: grey;
  border: none;
`

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

export const Header = ({ toggleSidebar }) => (
  <HeaderContainer className="u-full-width">
    <Flex>
      <Palm>
        <span role="img" aria-label="palm emoji">
          🔮
        </span>
      </Palm>
      <div>
        <TitleContainer>
          <Title>FPJS</Title>
          <ExampleBtn type="button" onClick={() => toggleSidebar()}>Examples</ExampleBtn>
        </TitleContainer>
        
        <Links>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/rametta/pratica"
          >
            Pratica
          </Link>
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
            href="https://redux.js.org/basics/store"
          >
            Redux
          </Link>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://lodash.com/docs"
          >
            Lodash
          </Link>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://rametta.org"
          >
            Rametta
          </Link>
        </Links>
      </div>
    </Flex>
  </HeaderContainer>
)
