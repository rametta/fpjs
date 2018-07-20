import React from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { ToastContainer, toast } from 'react-toastify'
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

export const Footer = ({ exec }) => (
  <FooterWrapper className="container">
    <button className="btn" onClick={exec} type="button">
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
