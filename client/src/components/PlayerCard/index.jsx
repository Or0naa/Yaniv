import React, { useEffect, useState } from 'react';
import style from './style.module.scss';

export default function PlayerCard({ name, image, count, wins }) {
    const [bgColor, setBgColor] = useState('');
    const [borderColor, setBorderColor] = useState('');

    // useEffect(() => {
    //     function randomColor() {
    //         const r = Math.floor(Math.random() * 256);
    //         const g = Math.floor(Math.random() * 256);
    //         const b = Math.floor(Math.random() * 256);
    //         return `rgb(${r}, ${g}, ${b})`;
    //     }

    //     setBgColor(randomColor());
    //     setBorderColor(randomColor());
    // }, []);

    return (
        <div className={style.playerCard}>
            <img className={style.upImg} src={image} alt={name} />
            <div className={style.upName}>{name}</div>
            <div dir='auto' className={style.main}>
                <img
                    // style={{ backgroundColor: bgColor, border: `4px solid ${borderColor}` }}
                    className={style.img}
                    src={image}
                    alt={name}
                />
                <div className={style.count}>{count} points</div>
            </div>
        </div>
    );
}
