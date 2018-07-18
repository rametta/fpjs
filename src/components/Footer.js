import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import styled from 'styled-components'
import { ToastContainer, toast } from 'react-toastify'
import { execute } from './../app.redux'
import 'react-toastify/dist/ReactToastify.css'

const FooterWrapper = styled.footer`
  display: flex;
  justify-content: space-between;
  color: gray;
`

const Gray = styled.span`
  color: gray;
`

// shorten :: String -> Promise
const shorten = (url) => axios.post('https://shortener.now.sh/shorten', { url })

const share = () => {
  shorten(window.location.href)
    .then(({ data: { link } }) => navigator.clipboard.writeText(link))
    .then(() => toast('Copied to clipboard 🎉'))
    .catch((err) => console.error(err))
}

const FooterContainer = ({ execute }) => (
  <FooterWrapper className="container">
    <button className="btn" onClick={execute} type="button">
      <span role="img" aria-label="fire emoji">
        🔥
      </span>{' '}
      Run <Gray>(Ctrl+Enter)</Gray>
    </button>

    {navigator.clipboard ? (
      <div>
        <button className="btn" type="button" onClick={share}>
          <span role="img" aria-label="sparkle emoji">
            ✨
          </span>{' '}
          Share
        </button>
        <ToastContainer />
      </div>
    ) : null}
  </FooterWrapper>
)

export const Footer = connect(
  ({ editor }) => ({ editor }),
  { execute }
)(FooterContainer)
