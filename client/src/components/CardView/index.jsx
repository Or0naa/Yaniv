import React, { useEffect, useState } from 'react'
import style from './style.module.scss';


export default function CardView({ value, suit }) {

    const [imgSuit, setImgSuit] = useState('')
    const [imgValue, setImgValue] = useState('')
    const [points, setPoints] = useState(0)
    useEffect(() => {
        setImgSuit(suit === "♣" ? "./clover.png" : suit === "♥" ? "./heart.png" : suit === "♦" ? "./diamond.png" : "./leaf.png")
        setImgValue(value == "1" ? "A" : value == "11" ? "./j.png" : value == "12" ? "./q.png" : value == "13" ? "./k.png" : value)
        setPoints(value == "Joker" ? 0 : value == "11" ? 10 : value == "12" ? 10 : value == "13" ? 10 : Number(value))
    }, [])

    if (suit === "Joker") {
        return (
            <div className={style.card}>
                <img className={style.up} src='./joker.png' alt='joker' />
                <img className={style.big} src='./joker.png' alt='joker' />
                <div className={style.points}>{points}</div>
            </div>
        )
    }
    if (value > 10) {
        return (
            <div className={style.card}>
                <img className={style.imgUp} src={imgSuit} alt={imgSuit} />
                <img className={style.imgDown} src={imgSuit} alt={imgSuit} />
                <img className={style.big} src={imgValue} alt={imgValue} />
                <div className={style.points}>{points}</div>
            </div>
        )
    }
    return (
        <div className={style.card}>
            <img className={style.imgUp} src={imgSuit} alt={imgSuit} />
            <img className={style.imgDown} src={imgSuit} alt={imgSuit} />
            <div className={style.value}>{imgValue}</div>
            <div className={style.points}>{points}</div>
        </div>
    )

}
