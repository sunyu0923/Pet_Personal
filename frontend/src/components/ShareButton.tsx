import { useState, type RefObject } from 'react'
import { toPng } from 'html-to-image'
import styles from './ShareButton.module.css'

interface ShareButtonProps {
  captureRef: RefObject<HTMLDivElement | null>
}

export default function ShareButton({ captureRef }: ShareButtonProps) {
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!captureRef.current || saving) return
    setSaving(true)
    try {
      const dataUrl = await toPng(captureRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#f8f9fa',
      })
      const link = document.createElement('a')
      link.download = 'PETI-结果.png'
      link.href = dataUrl
      link.click()
    } catch {
      // fallback: copy link
      try {
        await navigator.clipboard.writeText(window.location.href)
      } catch { /* ignore */ }
    } finally {
      setSaving(false)
    }
  }

  return (
    <button className={styles.btn} onClick={handleSave} disabled={saving}>
      {saving ? '⏳ 生成中…' : '📸 保存结果图片'}
    </button>
  )
}
