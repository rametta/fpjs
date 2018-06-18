import React from 'react'

export const Error = ({ error }) => (
  <div className="container result-box">
    <pre>
      <code className="overflow red">{error}</code>
    </pre>
  </div>
)
