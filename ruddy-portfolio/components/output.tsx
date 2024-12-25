interface OutputProps {
  history: (string | JSX.Element)[]
}

export function Output({ history }: OutputProps) {
  return (
    <div className="space-y-1">
      {history.map((line, index) => (
        <div key={index}>
          {typeof line === 'string' ? (
            <pre className="whitespace-pre-wrap break-words font-mono">{line}</pre>
          ) : (
            line
          )}
        </div>
      ))}
    </div>
  )
}

