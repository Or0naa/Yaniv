// Board.jsx
import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useGameStore, usePopupStore, useUserStore } from '../../store';
import CardView from '../../components/CardView';
import PlayerCard from '../../components/PlayerCard';
import Yaniv from '../../components/Yaniv';
import BackCard from '../../components/BackCard';
import StartRound from '../../components/StartRound';

export default function Board() {
  const game = useGameStore(state => state.game);
  const startGame = useGameStore(state => state.startGame);
  const updateGame = useGameStore(state => state.updateGame);
  const declareYaniv = useGameStore(state => state.declareYaniv);
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const [isYaniv, setIsYaniv] = useState(false);
  const [currentPoint, setCurrentPoint] = useState(0);
  const [chosenCards, setChosenCards] = useState([]);
  const openPopup = usePopupStore(state => state.openPopup);
  const [myCards, setMyCards] = useState([]);
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [takeCard, setTakeCard] = useState(false);
  const [isMe, setIsMe] = useState({})

  useEffect(() => {
    const updatePlayer = game.players.find(p => p.id === user.id)

    const calculationPoint = updatePlayer.userCards.reduce((acc, card) => acc + card.value, 0);
    setCurrentPoint(calculationPoint);
    setIsYaniv(calculationPoint <= 7);
    setOtherPlayers(game.players.filter(p => p.id !== updatePlayer.id));
    setMyCards(updatePlayer.userCards);
    setIsMe(updatePlayer)

  }, [user, game]);

  console.log({ chosenCards, })

  const handleChooseCard = (card) => {
    setChosenCards((prev) => {
      if (prev.includes(card)) {
        return prev.filter(c => c !== card);
      }

      const sameNumber = prev.every(c => c.number === card.number || c.number === "Joker");
      if (sameNumber) {
        return [...prev, card];
      }

      const sameSuit = prev.every(c => c.suit === card.suit || c.suit === "Joker");
      if (sameSuit) {
        const cardNumbers = prev.map(c => c.number).concat(card.number).filter(n => n !== "Joker");
        const uniqueNumbers = [...new Set(cardNumbers)].sort((a, b) => a - b);

        const isConsecutiveWithJoker = (numbers) => {
          let jokerCount = prev.filter(c => c.number === "Joker").length + (card.number === "Joker" ? 1 : 0);
          for (let i = 1; i < numbers.length; i++) {
            const diff = numbers[i] - numbers[i - 1];
            if (diff > 1) {
              if (jokerCount >= diff - 1) {
                jokerCount -= diff - 1;
              } else {
                return false;
              }
            }
          }
          return true;
        };

        if (isConsecutiveWithJoker(uniqueNumbers)) {
          return [...prev, card];
        }
      }

      return [card];
    });
  };
  const handleYaniv = () => {
    if (!isYaniv || game.currentPlayer !== game.players.findIndex(p => p.id === isMe.id)) {
      return;
    }
    declareYaniv(isMe.id);
  };
  const handleStart = () => {
    startGame(game);
  };
  const handlePopup = () => {
    openPopup(<div>הסברים</div>);
  };

  const handlePlaceCards = () => {
    if (chosenCards.length < 1 || game.currentPlayer !== game.players.findIndex(p => p.id === isMe.id)) {
      return;
    }
    if (chosenCards.length>1){
      if (chosenCards[0].number !== chosenCards[1].number && chosenCards.length<3) {
        return;
      }
      if (chosenCards[0].number==chosenCards[1].number){
        setQuickPlayCard(chosenCards[0].number);
      }
    }
    if (chosenCards.length === 1) {
      setQuickPlayCard(chosenCards[0].number);
    }

    const gameToUpdate = { ...game };
    gameToUpdate.openCards = [...gameToUpdate.openCards, ...chosenCards];
    const userToUpdate = { ...isMe };
    const leftCards = userToUpdate.userCards.filter(card => !chosenCards.includes(card));
    userToUpdate.userCards = leftCards;
    gameToUpdate.players = gameToUpdate.players.map(p => p.id === userToUpdate.id ? userToUpdate : p);
    updateGame(gameToUpdate);
    setUser(userToUpdate);
    setMyCards(leftCards);
    setTakeCard(true);
  };

  const handleTakeCard = (card, from) => {
    if (!takeCard || game.currentPlayer !== game.players.findIndex(p => p.id === isMe.id)) {
      return;
    }
    let turn = (game.currentPlayer + 1) % game.players.length;
    const gameToUpdate = { ...game, currentPlayer: turn };

    if (from === "deck") {
      const updateDeck = gameToUpdate.deck.filter(c => c !== card);
      gameToUpdate.deck = updateDeck;
    } else if (from === "openCards") {
      const updateOpenCards = gameToUpdate.openCards.filter(c => c !== card);
      gameToUpdate.openCards = updateOpenCards;
    }

    const userToUpdate = { ...user };
    const newCards = [...userToUpdate.userCards, card];
    setMyCards(newCards);
    userToUpdate.userCards = newCards;
    gameToUpdate.players = gameToUpdate.players.map(p => p.id === userToUpdate.id ? userToUpdate : p);
    gameToUpdate.lastCard = chosenCards;
    updateGame(gameToUpdate);
    setUser(userToUpdate);
    setChosenCards([]);
    setTakeCard(false);
  };

  const isMyTurn = game.currentPlayer === game.players.findIndex(p => p.id === isMe.id);
  const [quickPlayCard, setQuickPlayCard] = useState(null);

  const handleQuickPlay = (card) => {
    console.log("handleQuickPlay", card);
    console.log({quickPlayCard})
    if (card.number !== quickPlayCard || game.currentPlayer === game.players.findIndex(p => p.id === isMe.id)+1) {
      return;
    }

    const gameToUpdate = { ...game };
    gameToUpdate.openCards = [...gameToUpdate.openCards, card];
    gameToUpdate.lastCard.push(card)
    const userToUpdate = { ...isMe };
    const leftCards = userToUpdate.userCards.filter(c => c !== card);
    userToUpdate.userCards = leftCards;
    gameToUpdate.players = gameToUpdate.players.map(p => p.id === userToUpdate.id ? userToUpdate : p);
    updateGame(gameToUpdate);
    setUser(userToUpdate);
    setMyCards(leftCards);
    setQuickPlayCard(null);
  };
  return (
    <div className={style.container}>
      <div>
        <div onClick={handleStart}><StartRound start={game.startGame}/></div>
        <button onClick={handlePopup}>?</button>
      </div>
      <div className={style.gameTable}>
        <div className={style.deck}>
          {game.deck.map((card, index) => (
            <div
              key={index}
              onClick={() => isMyTurn && takeCard && handleTakeCard(card, "deck")}
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
              onClick={() => isMyTurn && !takeCard && handleChooseCard(card)}
              style={{ zIndex: index, transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)` }}>
              <CardView value={card.number} suit={card.suit} />
            </div>
          ))}
          <div className={takeCard ? style.lastCard : style.notYet}>
            {game.lastCard && game.lastCard.map((card, index) => (
              <div
                key={index}
                onClick={() => isMyTurn && takeCard && handleTakeCard(card, "openCards")}>
                <CardView value={card.number} suit={card.suit} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={style.user}>
        <button onClick={handlePlaceCards} disabled={!isMyTurn || takeCard}>Make Move</button>
        <div className={style.myCards}>
          {myCards.map((card, index) => (
            <div
              key={index}
              className={style.userCard}
              onClick={() => isMyTurn && !takeCard && handleChooseCard(card)}
              onDoubleClick={() => handleQuickPlay(card)}
              style={{ marginBottom: chosenCards.includes(card) ? '20px' : '0px' }}
            >
              <CardView value={card.number} suit={card.suit} />
            </div>
          ))}
        </div>
        <div>מספר הנקודות כרגע: {currentPoint}</div>
        <div>מספר הנקודות בקלפים שנבחרו: {chosenCards.reduce((acc, card) => acc + card.value, 0)}</div>
        <PlayerCard image={isMe.image} name={isMe.name} score={isMe.score} />

        <div onClick={handleYaniv} className={isYaniv && isMyTurn ? style.yaniv : style.yanivDisabled}>
          <Yaniv click={isYaniv && isMyTurn && !takeCard} />
        </div>
      </div>
      <div>
        {otherPlayers && otherPlayers.map((player, index) => (
          <div key={player.id} className={style[`player${index + 2}`]}>
            {player.userCards && player.userCards.length > 0 ? (
              player.userCards.slice(0, 5).map((card, cardIndex) => (
                <div key={cardIndex}
                  style={{ left: `${cardIndex * 10}px` }}
                  className={style.opponentCard}>
                  <PlayerCard image={player.image} name={player.name} score={isMe.score}  />
                </div>
              ))
            ) : (
              <div>{`ל${player.name} לא נשארו קלפים`}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}