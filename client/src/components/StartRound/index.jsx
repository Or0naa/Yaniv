import React from 'react'
import style from './style.module.scss'


export default function StartRound({ start = true }) {

    return (
        <div className={start ? style.inRound : style.startRound}>
            <button className={style.button}> start a game round</button>
        </div>
    )
}
