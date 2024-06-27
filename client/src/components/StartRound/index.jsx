import React from 'react'
import style from './style.module.scss'
import { useGameStore } from '../../store'
import PlayerCard from '../PlayerCard'
import CardView from '../CardView'

export default function StartRound({ start = true }) {
    const game = useGameStore(state => state.game)
    console.log(game.lastGame)
    return (
        <div className={start ? style.inRound : style.startRound}>
            <button className={style.button}> start a game round</button>
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
