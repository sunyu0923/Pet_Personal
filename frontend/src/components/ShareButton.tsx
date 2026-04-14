import { useState } from 'react'
import styles from './ShareButton.module.css'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback: select and copy
    }
  }

  return (
    <button className={styles.btn} onClick={handleCopy}>
      {copied ? '✓ 链接已复制！' : '🔗 分享结果'}
    </button>
  )
}
