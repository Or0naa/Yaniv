import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useGameStore, usePopupStore, useUserStore } from '../../store';
import CardView from '../../components/CardView';
import PlayerCard from '../../components/PlayerCard';
import Logo from '../../components/Logo';
import Yaniv from '../../components/Yaniv';
import BackCard from '../../components/BackCard';

export default function Board() {
  const game = useGameStore(state => state.game);
  const startGame = useGameStore(state => state.startGame)
  const updateGame = useGameStore(state => state.updateGame)
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser)
  const [isYaniv, setIsYaniv] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [chosenCards, setChosenCards] = useState([]);
  const openPopup = usePopupStore(state => state.openPopup)

  useEffect(() => {
    const calculationPoint = user.userCards.reduce((acc, card) => acc + card.value, 0);
    setCurrentPoint(calculationPoint);
    setIsYaniv(calculationPoint <= 7);
  }, [user, game]);

  const handleChooseCard = (card) => {
    setChosenCards((prev) => {
      // Check if the card is already selected
      if (prev.includes(card)) {
        return prev.filter(c => c !== card);
      }

      // Check for matching numbers
      const sameNumber = prev.every(c => c.number === card.number);
      if (sameNumber) {
        return [...prev, card];
      }

      // Check for same suit and consecutive numbers
      const sameSuit = prev.every(c => c.suit === card.suit || c.suit === "Joker");
      if (sameSuit) {
        const cardNumbers = prev.map(c => c.number).concat(card.number).filter(n => n !== "Joker");
        const uniqueNumbers = [...new Set(cardNumbers)].sort((a, b) => a - b);
        const isConsecutive = uniqueNumbers.every((num, idx) => idx === 0 || num - uniqueNumbers[idx - 1] === 1);

        if (isConsecutive) {
          return [...prev, card];
        }
      }

      // If the new card doesn't match any condition, reset the selection
      return [card];
    });
  };

  console.log({ game })
  console.log({ user })

  const handleYaniv = () => {
    if (!isYaniv) {
      return;
    }
    console.log("yaniv");
  };

  const handleStart = () => {
    startGame()
  }
  const handlePopup = () => {
    openPopup(
      <div>הסברים</div>
    )
  }

  const handlePlaceCards = () => {
    if (chosenCards.length <1) {
      return;
    }
    // if (game.players[game.currentPlayer].id !== user.id) {
    //   return;
    // }
    let turn = game.currentPlayer+1;
    if (turn >= game.players.length) {
      turn = 0;
    }
    const gameToUpdate = { ...game, lastCard: chosenCards, currentPlayer: turn};
    gameToUpdate.openCards = [...gameToUpdate.openCards, ...chosenCards];
    const userToUpdate = { ...user };
    userToUpdate.userCards = userToUpdate.userCards.filter(card => !chosenCards.includes(card));
    gameToUpdate.players = gameToUpdate.players.map(p => p.id === userToUpdate.id ? userToUpdate : p);
    updateGame(gameToUpdate);
    setUser(userToUpdate);
    setChosenCards([]);

  };


  return (
    <div className={style.container}>
      <div>
        <button onClick={handleStart}>start</button>
        <button onClick={handlePopup}>?</button>
      </div> <div className={style.gameTable}>
        <div className={style.deck}>
          {game.deck.map((card, index) => (
            <div
              key={index}
              className={style.card}
              style={{ zIndex: index, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}>
              <BackCard />
            </div>
          ))}
        </div>
        <div className={style.deck}>
          {game.openCards.map((card, index) => (
            <div
              key={index}
              className={style.card}
              onClick={() => handleChooseCard(card)}
              style={{ marginBottom: chosenCards.includes(card) ? '20px' : '0px' }}
            >
              <CardView value={card.number} suit={card.suit} />
            </div>
          ))}
        </div>
      </div>
      <div className={style.user}>
        <button onClick={handlePlaceCards}>Make Move</button>
        <div className={style.myCards}>
          {user.userCards.map((card, index) => (
            <div
              key={index}
              className={style.userCard}
              onClick={() => handleChooseCard(card)}
              style={{ marginBottom: chosenCards.includes(card) ? '20px' : '0px' }}
            >
              <CardView value={card.number} suit={card.suit} />
            </div>
          ))}
        </div>
        <div>מספר הנקודות כרגע: {currentPoint}</div>
        <div>מספר הנקודות בקלפים שנבחרו:  {chosenCards.reduce((acc, card) => acc + card.value, 0)}</div>
        <PlayerCard image={user.image} name={user.name} />

        <div onClick={handleYaniv} className={style.yaniv}>
          <Yaniv click={isYaniv} />
        </div>
      </div>
    </div>
  );
}
