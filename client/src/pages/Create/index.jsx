import React, { useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store';

export default function Create() {
    const nav = useNavigate();
    const createGame = useGameStore(state => state.createGame);
    const [numPlayers, setNumPlayers] = useState(2);
    const [yaniv, setYaniv] = useState(7);

    const handleCreate = (e) => {
        e.preventDefault();
        console.log(`Creating game with ${numPlayers} players and Yaniv value of ${yaniv}`);
        createGame(numPlayers, yaniv);
        nav('/waiting');
    };

    return (
        <div className={style.create}>
            <form onSubmit={handleCreate}>
                <div className={style.numPlayers}>
                    <p>how many players in the game?</p>
                    {[1, 2, 3, 4].map(num => (
                        <button
                            key={num}
                            type="button"
                            className={numPlayers === num ? style.choosen : ""}
                            onClick={() => {
                                console.log(`Selected ${num} players`);
                                setNumPlayers(num);
                            }}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <div className={style.yaniv}>
                    <p>call yaniv when your cards value is:</p>
                    {[5, 7].map(val => (
                        <button
                            key={val}
                            type="button"
                            className={yaniv === val ? style.choosen : ""}
                            onClick={() => {
                                console.log(`Selected Yaniv value ${val}`);
                                setYaniv(val);
                            }}
                        >
                            {val}
                        </button>
                    ))}
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
