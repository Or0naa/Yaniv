import React from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import CardView from '../../components/CardView';
import BackCard from '../../components/BackCard';

export default function OpenPage() {
    const nav = useNavigate();
    const randomCard = ()=>{
        return Math.floor(Math.random() * 13) + 1;
    }

    return (
        <div className={style.openPage} onClick={() => nav('/welcome')}>
            <div className={style.logo}>
                <img src="./logo.png" alt="logo" />
</div>
            <div className={style.cardFan}>
                <div className={style.card}>
                    <CardView value={'Joker'} suit={'Joker'} />
                </div>
                <div className={style.card}>
                    <CardView value={randomCard()} suit={''} />
                </div>
                <div className={style.card}>
                    <CardView value={randomCard()} suit={'♦'} />
                </div>
                <div className={style.card}>
                    <CardView value={randomCard()} suit={'♥'} />
                </div> <div className={style.card}>
                    <CardView value={randomCard()} suit={'♣'} />
                </div>
            </div>

            <div className={style.deck}>
                <div className={style.backCardPile}>
                    <div className={style.deckCard}>
                        <BackCard style={{ zIndex: 1, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }} />
                    </div>
                    <div className={style.deckCard}>
                        <BackCard style={{ zIndex: 2, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }} />
                    </div>
                    <div className={style.deckCard}>
                        <BackCard style={{ zIndex: 3, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }} />
                    </div>
                    <div className={style.deckCard}>
                        <BackCard style={{ zIndex: 4, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }} />
                    </div>
                    <div className={style.deckCard}>
                        <BackCard style={{ zIndex: 5, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }} />
                    </div>
                </div>
                <div className={style.OpenCardPile}>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 1, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={randomCard()} suit={'♦'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 2, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={randomCard()} suit={'♣'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 3, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={randomCard()} suit={'♦'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 4, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={randomCard()} suit={'♦'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 5, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={randomCard()} suit={'♥'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 6, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={randomCard()} suit={'♦'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 7, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={randomCard()} suit={'♥'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 8, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={randomCard()} suit={'♣'} />
                    </div>
                </div>
            </div>
            <div className={style.opponentFan}>
                <div className={style.card}>
                    <BackCard className={style.card} /> </div>
                <div className={style.card}>
                    <BackCard className={style.card} /> </div>
                <div className={style.card}>
                    <BackCard className={style.card} /> </div>
                <div className={style.card}>
                    <BackCard className={style.card} /> </div>
                <div className={style.card}>
                    <BackCard className={style.card} /> </div>
            </div>
        </div >
    );
}
