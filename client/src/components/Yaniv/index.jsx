import React from 'react'
import style from './style.module.scss'

export default function Yaniv({ click=true }) {
    return (
        <button className={click ? style.clicked : style.button}>
            <img src="./logo.png" alt="yaniv" />
        </button>
    )
}
