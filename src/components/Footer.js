import React from 'react'

export const Footer = ({ execute }) => (
  <footer className="container footer">
    <button className="btn" onClick={execute}>
      Run (Ctrl+Enter)
    </button>
    <a href="https://github.com/rametta/sanctuary-sandbox" className="link">
      Made by Jason
    </a>
  </footer>
)
