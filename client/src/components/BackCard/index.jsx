import React from 'react'
import style from './style.module.scss'

export default function BackCard(deck=false) {
  return (
    <div className={deck? style.deckCard: style.cardGame} >
      <img src="./back.png" alt='back'/>
    </div>
  )
}
