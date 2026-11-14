interface MarkedProps {
  /** Plain text where `==phrase==` is drawn with the highlighter and `` `code` `` is set in mono. */
  text: string
}

export function Marked({ text }: MarkedProps) {
  const parts = text.split(/(==.+?==|`[^`]+`)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part
        if (part.startsWith('`')) {
          return (
            <code key={i} className="inline-code">
              {part.slice(1, -1)}
            </code>
          )
        }
        return (
          <mark key={i} className="mark">
            {part.slice(2, -2)}
          </mark>
        )
      })}
    </>
  )
}
