import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store'

export default function Create() {
    const nav = useNavigate()
    const createGame = useGameStore(state => state.createGame)

    const handleCreate = (e) => {
        e.preventDefault()
        const players = e.target.players.value
        createGame(players)

        nav('/waiting')
    }
    return (
        <div>
            How many players in the game?
            <form onSubmit={handleCreate}>
                <input type="number" name="players" placeholder="number of players" max={4} min={1} />
                <button type="submit">Create</button></form>
        </div>
    )
}
