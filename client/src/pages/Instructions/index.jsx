import React, { useState } from 'react';
import style from './style.module.scss'; // We'll create this CSS file for styling

export default function Instructions() {
  const [language, setLanguage] = useState('hebrew');

  const rules = {
    hebrew: [
      { title: "מספר קלפים", content: "מקסימום 5 קלפים ביד" },
      { title: "הנחת קלפים", content: "ניתן להניח קלפים עם ערך זהה או עם סמל זהה ובהפרש של 1 בערך" },
      { title: "ג'וקר", content: "ניתן להשתמש בג'וקר כחלופה לכל קלף" },
      { title: "לקיחת קלף", content: "חובה לקחת קלף מאחת הערימות אחרי כל תור" },
      { title: "הדבקת קלף", content: "ניתן להדביק קלף זהה אם השחקן הבא עוד לא שיחק. למחשב יש השהייה של 2 שניות" },
      { title: "ספירת נקודות", content: "יש ספירה כללית של כל המשחקים עד 100, וספירה משתנה של המשחק הנוכחי הנראית רק לך" },
      { title: 'הכרזת "יניב"', content: 'ניתן להכריז "יניב" רק כאשר סכום הקלפים נמוך מ-7' },
      { title: "החלטות המחשב", content: "כל החלטות המחשב הן אקראיות, מתחילים ב-50/50" },
      { title: "מקרה מיוחד", content: 'אם שחקן מכריז על ניצחון, אך לשחקן אחר יש סכום קלפים נמוך יותר, מתרחש "מקרה של אסף"' }
    ],
    english: [
      { title: "Number of Cards", content: "Maximum of 5 cards in hand" },
      { title: "Placing Cards", content: "You can place cards with the same value or with the same symbol and a difference of 1 in value" },
      { title: "Joker", content: "Joker can be used as a substitute for any card" },
      { title: "Drawing a Card", content: "You must draw a card from one of the piles after each turn" },
      { title: "Sticking a Card", content: "You can stick an identical card if the next player hasn't played yet. The computer has a 2-second delay" },
      { title: "Score Counting", content: "There's a general count of all games up to 100, and a variable count of the current game visible only to you" },
      { title: 'Declaring "Yaniv"', content: 'You can declare "Yaniv" only when the sum of your cards is less than 7' },
      { title: "Computer Decisions", content: "All computer decisions are random, starting at 50/50" },
      { title: "Special Case", content: 'If a player declares victory, but another player has a lower sum of cards, an "Assaf case" occurs' }
    ]
  };

  return (
    <div className={style.instructions_container}>
      <h2>{language === 'hebrew' ? 'חוקי המשחק' : 'Game Rules'}</h2>
      <button onClick={() => setLanguage(language === 'hebrew' ? 'english' : 'hebrew')}>
        {language === 'hebrew' ? 'Switch to English' : 'עבור לעברית'}
      </button>
      <div className={style.rules_list}>
        {rules[language].map((rule, index) => (
          <div key={index} className={style.rule_item}>
            <h3>{rule.title}</h3>
            <p>{rule.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}