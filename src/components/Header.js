import React from 'react'

export const Header = () => (
  <header className="container header">
    <h1>
      <span role="img" aria-label="palm emoji">
        🌴
      </span>{' '}
      Sanctuary Sandbox
    </h1>
    <small>
      <a
        rel="noopener noreferrer"
        target="_blank"
        href="https://github.com/sanctuary-js/sanctuary"
        className="link"
      >
        Docs
      </a>
    </small>
  </header>
)
