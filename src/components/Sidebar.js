import React, { Component } from 'react'
import styled from 'styled-components'

const examples = [
  {
    display: 'Sanctuary Compose',
    link: '/?script=S.compose%20(Math.sqrt)%20(S.add%20(1))%20(8)',
  },
  {
    display: 'Sanctuary Maybe',
    link: '/?script=const%20data%20%3D%20%5B%7B%20age%3A%2024%2C%20name%3A%20%27jason%27%7D%2C%20%7B%20age%3A%2010%2C%20name%3A%20%27bob%27%20%7D%5D%0A%0Aconst%20peopleUnderThree%20%3D%20S.filter%20(person%20%3D>%20person.age%20<%203)%20(data)%0A%0Aconst%20maybePeopleUnderThree%20%3D%20peopleUnderThree.length%20>%200%0A%20%20%3F%20S.Just(peopleUnderThree)%0A%20%20%3A%20S.Nothing%0A%20%20%0AS.isNothing(maybePeopleUnderThree)',
  },
  {
    display: 'Sanctuary Either',
    link: '/?script=const%20data%20%3D%20%5B%7B%20age%3A%2024%2C%20name%3A%20%27jason%27%7D%2C%20%7B%20age%3A%2010%2C%20name%3A%20%27bob%27%20%7D%5D%0A%0Aconst%20peopleOverThree%20%3D%20S.filter%20(person%20%3D>%20person.age%20>%203)%20(data)%0A%0Aconst%20eitherPeopleOverThree%20%3D%20peopleOverThree.length%20>%200%0A%20%20%3F%20S.Right(peopleOverThree)%0A%20%20%3A%20S.Left(%27No%20people%20over%20three%27)%0A%20%20%0AS.isRight(eitherPeopleOverThree)%0A%0AS.either%20(err%20%3D>%20err)%20(people%20%3D>%20people)%20(eitherPeopleOverThree)',
  },
  {
    display: 'Partial.lenses Get',
    link: '/?script=const%20data%20%3D%20%7B%0A%20%20name%3A%20%27jason%27%2C%0A%20%20cool%3A%20true%2C%0A%20%20age%3A%2024%2C%0A%20%20cats%3A%20%5B%0A%20%20%20%20%7B%20name%3A%20%27fluffy%27%2C%20lives%3A%205%20%7D%2C%0A%20%20%20%20%7B%20name%3A%20%27sparklez%27%2C%20lives%3A%208%20%7D%2C%0A%20%20%5D%0A%7D%0A%0Aconst%20getFluffyLives%20%3D%20L.get(%5B%27cats%27%2C%200%2C%20%27lives%27%5D)%0A%0AgetFluffyLives(data)',
  },
  {
    display: 'Partial.lenses Filter',
    link: '/?script=const%20data%20%3D%20%7B%0A%20%20name%3A%20%27jason%27%2C%0A%20%20cool%3A%20true%2C%0A%20%20age%3A%2024%2C%0A%20%20cats%3A%20%5B%0A%20%20%20%20%7B%20name%3A%20%27fluffy%27%2C%20lives%3A%205%20%7D%2C%0A%20%20%20%20%7B%20name%3A%20%27sparklez%27%2C%20lives%3A%208%20%7D%2C%0A%20%20%5D%0A%7D%0A%0Aconst%20catsWithMoreThan5Lives%20%3D%20L.collect(%5B%27cats%27%2C%20L.elems%2C%20L.when(L.get(%5B%27lives%27%2C%20lives%20%3D>%20lives%20>%205%5D))%5D)%0A%0AcatsWithMoreThan5Lives(data)',
  },
  {
    display: 'Partial.lenses Modify',
    link: '/?script=const%20data%20%3D%20%7B%0A%20%20name%3A%20%27jason%27%2C%0A%20%20cool%3A%20true%2C%0A%20%20age%3A%2024%2C%0A%20%20cats%3A%20%5B%0A%20%20%20%20%7B%20name%3A%20%27fluffy%27%2C%20lives%3A%205%20%7D%2C%0A%20%20%20%20%7B%20name%3A%20%27sparklez%27%2C%20lives%3A%208%20%7D%2C%0A%20%20%5D%0A%7D%0A%0Aconst%20catNameModify%20%3D%20L.modify(%5B%27cats%27%2C%20L.elems%2C%20%27name%27%5D)%0A%0AcatNameModify(name%20%3D>%20name%20%2B%20%27ison%27)(data)',
  },
  {
    display: 'Daggy taggedSum',
    link: '/?script=const%20Status%20%3D%20daggy.taggedSum(%27Status%27%2C%20%7B%0A%20%20Loading%3A%20%5B%5D%2C%0A%20%20Data%3A%20%5B%27data%27%5D%2C%0A%20%20Empty%3A%20%5B%5D%0A%7D)%0A%0Aconst%20pageLoad%20%3D%20Status.Data(%7B%20hello%3A%206%20%7D)%0A%0A%2F%2F%20pattern%20matching%0ApageLoad.cata(%7B%0A%20%20Loading%3A%20()%20%3D>%20%27Page%20loading...%27%2C%0A%20%20Empty%3A%20()%20%3D>%20%27No%20data%20to%20display...%27%2C%0A%20%20Data%3A%20data%20%3D>%20data.hello%0A%7D)',
  }
]

const SideBarContainer = styled.div`
  height: 100%;
  width: 300px;
  background: #373c5b;
  z-index: 10;
  overflow: auto;
  position: fixed;
  box-shadow: 10px 0px 27px 0px rgba(0, 0, 0, 0.3);
`

const Title = styled.p`
  color: white;
  margin-left: 1em;
  margin-top: 0.5em;
`

const List = styled.ul``

const Item = styled.li``

const ItemLink = styled.a`
  width: 100%;
  color: white;
  text-decoration: none;
  &:hover {
    color: #d1d1d1;
  }
`

const SideBarBackground = styled.div`
  height: 100%;
  width: 100%;
  opacity: 0.3;
  background: black;
  z-index: 8;
  overflow: auto;
  position: fixed;
  cursor: pointer;
`

export class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.escFunction = this.escFunction.bind(this)
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      this.props.toggleSidebar()
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false)
  }

  render() {
    const { toggleSidebar } = this.props
    return (
      <>
        <SideBarBackground onClick={toggleSidebar} />
        <SideBarContainer>
          <Title>Examples</Title>
          <List>
            {examples.map(example => (
              <Item key={example.display}>
                <ItemLink href={example.link}>{example.display}</ItemLink>
              </Item>
            ))}
          </List>
        </SideBarContainer>
      </>
    )
  }
}
