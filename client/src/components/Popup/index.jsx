import React, { useRef, useEffect, useState } from 'react'
import { usePopupStore } from '../../store'
import style from './style.module.scss'

const Popup = () => {
  const { isOpen, content, closePopup } = usePopupStore()
  const [isAnimating, setIsAnimating] = useState(false)
  const popupRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300) // Matches the CSS transition duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, closePopup])

  if (!isAnimating && !isOpen) return null

  return (
    <div className={`${style.popup_overlay} ${isOpen ? style.open : ''}`}>
      <div ref={popupRef} className={`${style.popup_content} ${isOpen ? style.open : ''}`}>
        {content}
        <button onClick={closePopup}>סגור</button>
      </div>
    </div>
  )
}

export default Popup