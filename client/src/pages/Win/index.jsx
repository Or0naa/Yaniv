import React from 'react'
import CardView from '../../components/CardView'
import PlayerCard from '../../components/PlayerCard'
import { useGameStore } from '../../store'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'

export default function Win() {
    const game = useGameStore(state => state.game)
    const nav = useNavigate()
    return (
        <div onClick={()=>nav('/game')} className={style.win}>
            {game.lastGame && game.winner && (
                <div>
                    <div>{game.winner}Won the game</div>
                    {game.lastGame.map((player, index) => (
                        <div className={style.player} key={index}>
                            <PlayerCard name={player.name} image={player.image} score={player.score} />
                            <div className={style.cards}>
                                {player.userCards.map((card, cardIndex) => (
                                    <div key={cardIndex}>
                                        <CardView value={card.number} suit={card.suit} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
