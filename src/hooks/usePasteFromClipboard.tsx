import React from 'react'

interface IArgs {
  onPaste: (files: File[]) => void
  onPasteRejected?: (files: File[]) => void
  accept: string[]
  maxSize?: number
}

export function usePasteFromClipboard({ onPaste, onPasteRejected, accept, maxSize }: IArgs) {
  const pasteFromClipboard = React.useCallback((originalEvent: Event) => {
    const e = originalEvent as ClipboardEvent
    if (e.clipboardData) {
      const items = e.clipboardData.items
      const accepted: File[] = []
      const rejected: File[] = []

      for (const item of items) {
        const file = item.getAsFile()
        if (file) {
          if (!accept.includes(file.type)) {
            rejected.push(file)
          } else if (maxSize && file.size > maxSize) {
            rejected.push(file)
          } else {
            accepted.push(file)
          }
        }
      }

      accepted.length && onPaste(accepted)
      rejected.length && onPasteRejected && onPasteRejected(rejected)
    }
  }, [onPaste, onPasteRejected, accept, maxSize])

  React.useEffect(() => {
    window.addEventListener('paste', pasteFromClipboard)
    return () => window.removeEventListener('paste', pasteFromClipboard)
  }, [pasteFromClipboard])
}
