import React, { useState } from 'react'
import Logo from '../../components/Logo'
import style from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import { useGameStore, usePopupStore, useUserStore } from '../../store'

export default function Welcome() {
    const nav = useNavigate()

    const openPopup = usePopupStore(state => state.openPopup)
    const createGame = useGameStore(state => state.createGame)
    const user = useUserStore(state => state.user)
    const joinGame = useGameStore(state => state.joinGame)
    const [code, setCode] = useState('')


    const handleOpenPopup = () => {
        openPopup(
            <div dir='rtl'>
                <h2>משחק יניב הגיע אלי ישר מהמילואים בעזה</h2>
                <p>כל אחד מקבל חמישה קלפים בסיבוב הראשון, </p>
                <p>ערך הנקודות של כל קלף שווה למספר שלו, מלבד משפחת המלוכה ששווים כולם לעשר נקודות</p>
                <p>המטרה היא להגיע לסך כללי של נקודות בקלפים שנמוך משבע,</p>
                <p>אפשר להוריד בכל תור קלף אחד, או אם יש לך זוג קלפים עם אותו הערך, </p>
                <p>או שלישיה ומעלה של קלפים עם ציור זהה בקפיצות של 1 (למשל 4 לב, 5 לב ו6 לב)</p>
                <p>אפשר להשתמש בג'וקר כחלופה לכל קלף</p>
                <p>ובכל תור צריך גם לקחת קלף אחד בחזרה, או קלף חדש מהערימה, או את הקלף האחרון שהונח</p>
                <p>אם במקרה הרמת קלף זהה לקלף שהרגע הנחת והחבר הבא בתוך עוד לא הניח את הקלף שלו- תוכל להניח את הקלף החדש</p>
                <p>אם סך הנקודות הנוכחי שלך נמוך משבע - זה הזמן להכריז יניב!</p>
                <p>ועכשיו כל שחקן, חוץ ממך, מוסיף את ערך הנקודות מהסבב הזה לסכום הנקודות הכללי שלו</p>
                <p>אבל זהירות: אם לאחד השחקנים יהיה ערך קלפים שווה או נמוך משלך- הוא עושה לך אסף</p>
                <p>וזה אומר שאף שחקן לא מוסיף נקודות לסך הכללי חוץ ממך שמקבל את סכום הנקודות שלך ועוד 30!!!</p>
                <p>אם סך הנקודות הכללי מגיע למספר 50 עגול - המספר יורד ל25</p>
                <p>גם במספר 100 עגול - סכום הנקודות יורד ל50</p>
                <p>אבל אם עברת את סך מאה נקודות- נגמר המשחק</p>
                <p>תהנו!!</p>
            </div>
        )
    }

    const handleCreateGame = () => {
        createGame()
        nav('/create')
    }

    const handleJoin = () => {
        joinGame(code, user)
        nav('/choose')
    }

    
    return (
        <div className={style.welcome}>
            <div className={style.Logo}>
                <Logo />
            </div>
            <form onSubmit={handleJoin}>
                <div className={style.input}>
                <input
                        type="text"
                        placeholder="Enter Your Code"
                        onChange={(e) => setCode(e.target.value)}
                    />                </div>
                <button type="submit" >join to game</button>
            </form>
            <div className={style.buttons}>
                <button onClick={handleCreateGame}>create game</button>
                <button onClick={handleOpenPopup}>how to play</button>
            </div>
        </div>
    )
}
