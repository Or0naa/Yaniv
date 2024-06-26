import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useGameStore, usePopupStore, useUserStore } from '../../store';
import CardView from '../../components/CardView';
import PlayerCard from '../../components/PlayerCard';
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
  const [myCards, setMyCards] = useState([]);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [takeCard, setTakeCard] = useState(false);

  useEffect(() => {
    const calculationPoint = user.userCards.reduce((acc, card) => acc + card.value, 0);
    setCurrentPoint(calculationPoint);
    setIsYaniv(calculationPoint <= 7);
    setOtherPlayers(game.players.filter(p => p.id !== user.id))
  }, [user, game]);

  useEffect(() => {
    setMyCards(user.userCards)
  }, [])

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
    if (chosenCards.length < 1) {
      return;
    }
    const gameToUpdate = { ...game };
    gameToUpdate.openCards = [...gameToUpdate.openCards, ...chosenCards];
    const userToUpdate = { ...user };
    const leftCards = userToUpdate.userCards.filter(card => !chosenCards.includes(card));
    userToUpdate.userCards = leftCards;
    gameToUpdate.players = gameToUpdate.players.map(p => p.id === userToUpdate.id ? userToUpdate : p);
    updateGame(gameToUpdate);
    setUser(userToUpdate);
    setMyCards(leftCards);
    setTakeCard(true);
  };
  const handleTakeCard = (card, from) => {
    console.log({ card, from })
    if (!takeCard) {
      return;
    }
    let turn = game.currentPlayer + 1;
    if (turn >= game.players.length) {
      turn = 0;
    }
    const gameToUpdate = { ...game, lastCard: chosenCards, currentPlayer: turn }
    if (from === "deck") {
      const updateDeck = [...game.deck];
      const cardIndex = updateDeck.indexOf(card);
      if (cardIndex === -1) {
        return;
      }
      updateDeck.splice(cardIndex, 1);  // חותכים את הקלף שנבחר מהערימה
      gameToUpdate.deck = updateDeck;
    }
  
    if (from === "openCards") {
      const updateOpenCards = [...game.openCards];
      const cardIndex = updateOpenCards.indexOf(card);
      if (cardIndex === -1) {
        return;
      }
      updateOpenCards.splice(cardIndex, 1);  // חותכים את הקלף שנבחר מהקלפים הפתוחים
      gameToUpdate.openCards = updateOpenCards;
    }
    const updateOpenCards = game.openCards.filter(c => c !== card);
    gameToUpdate.openCards = updateOpenCards
  
  const userToUpdate = { ...user };
  const newCards = [...userToUpdate.userCards, card];
  setMyCards(newCards);
  userToUpdate.userCards = newCards;
  gameToUpdate.players = gameToUpdate.players.map(p => p.id === userToUpdate.id ? userToUpdate : p);
  updateGame(gameToUpdate);
  setUser(userToUpdate);
  setChosenCards([]);
  setTakeCard(false);
}

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
            onClick={() => handleTakeCard(card, "deck")}  // פונקציה אנונימית
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
            style={{ zIndex: index, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}>
            <CardView value={card.number} suit={card.suit} />
          </div>
        ))}
        <div className={takeCard ? style.lastCard : style.notYet}>
          {game.lastCard && game.lastCard.map((card, index) => (
            <div
              key={index}
              onClick={() => handleTakeCard(card, "openCards")}> 
              <CardView value={card.number} suit={card.suit} />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className={style.user}>
      <button onClick={handlePlaceCards}>Make Move</button>
      <div className={style.myCards}>
        {myCards.map((card, index) => (
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
    <div>
      <div className={style.player2}>
        {otherPlayers && otherPlayers[0] && <PlayerCard image={otherPlayers[0].image} name={otherPlayers[0].name} />}      </div>
      <div className={style.player3}>
        {otherPlayers && otherPlayers[1] && <PlayerCard image={otherPlayers[1].image} name={otherPlayers[1].name} />}      </div>
      <div className={style.player4}>
        {otherPlayers && otherPlayers[2] && <PlayerCard image={otherPlayers[2].image} name={otherPlayers[2].name} />}      </div>
    </div>
  </div>
);
}
