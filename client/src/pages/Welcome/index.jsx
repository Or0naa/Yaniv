import React, { useEffect, useState } from 'react'
import Logo from '../../components/Logo'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useGameStore, useLanguageStore, usePopupStore, useUserStore } from '../../store'
import { translations } from '../../helpers/translations'

export default function Welcome() {
    const nav = useNavigate()

    const openPopup = usePopupStore(state => state.openPopup)
    const game = useGameStore(state => state.game)
    const user = useUserStore(state => state.user)
    const joinGame = useGameStore(state => state.joinGame)
    const [code, setCode] = useState('')
    const language = useLanguageStore(state => state.language);

    const handleOpenPopup = () => {
        const { language } = useLanguageStore.getState();
        const { howToPlayPopup } = translations;
        const rules = howToPlayPopup.rules.map((rule, index) => (
          <p key={index}>{rule[language]}</p>
        ));
      
        openPopup(
          <div>
            <h2>{howToPlayPopup.title[language]}</h2>
            {rules}
          </div>
        );
      };

    const handleCreateGame = () => {
        nav('/create')
    }

    const handleJoin = () => {
        joinGame(code, user)
        nav('/waiting')
    }

    useEffect(() => {
        console.log("Language changed to:", language);
    }, [language]);




    return (
        <div className={style.welcome}>
            <div className={style.Logo}>
                <Logo />
            </div>
            <form onSubmit={handleJoin}>
                <div className={style.input}>
                    <input
                        type="text"
                        placeholder={translations.EnterYourCode[language]}
                        onChange={(e) => setCode(e.target.value)}
                    />                </div>
                <button type="submit" >{translations.joinGame[language]}</button>
            </form>
            <div className={style.buttons}>
                <button onClick={handleCreateGame}>{translations.createGame[language]}</button>
                <button onClick={handleOpenPopup}>{translations.howToPlay[language]}</button>
            </div>
        </div>
    )
}
