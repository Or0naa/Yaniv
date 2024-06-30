import React from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import CardView from '../../components/CardView';
import BackCard from '../../components/BackCard';

export default function OpenPage() {
    const nav = useNavigate();

    return (
        <div className={style.openPage} onClick={() => nav('/welcome')}>
            <div className={style.logo}>
            <Logo />
</div>
            <div className={style.cardFan}>
                <div className={style.card}>
                    <CardView value={'Joker'} suit={'Joker'} />
                </div>
                <div className={style.card}>
                    <CardView value={'1'} suit={''} />
                </div>
                <div className={style.card}>
                    <CardView className={style.card} value={'11'} suit={'♦'} />
                </div>
                <div className={style.card}>
                    <CardView value={'12'} suit={'♥'} />
                </div> <div className={style.card}>
                    <CardView value={'13'} suit={'♣'} />
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
                            value={'5'} suit={'♦'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 2, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={'1'} suit={'♣'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 3, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={'9'} suit={'♦'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 4, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={'10'} suit={'♦'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 5, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={'3'} suit={'♥'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 6, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={'11'} suit={'♦'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 7, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={'8'} suit={'♥'} />
                    </div>
                    <div className={style.deckCard}>
                        <CardView
                            style={{ zIndex: 8, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}
                            value={'8'} suit={'♣'} />
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
