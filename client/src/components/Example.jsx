import React from 'react'
import {usePopupStore} from '../store'

const ExampleComponent = () => {
  const openPopup = usePopupStore(state => state.openPopup)

  const handleOpenPopup = () => {
    openPopup(
      <div>
        <h2>זהו פופאפ לדוגמה</h2>
        <p>כאן יכול להיות כל תוכן שתרצי.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>קומפוננטה לדוגמה</h1>
      <button onClick={handleOpenPopup}>פתח פופאפ</button>
    </div>
  )
}

export default ExampleComponent