import React from 'react'

export const Result = ({ result }) => (
  <div className="container result-box">
    <pre>
      <code className="overflow">{result}</code>
    </pre>
  </div>
)
