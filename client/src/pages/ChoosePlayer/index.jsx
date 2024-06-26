import React, { useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import Logo from '../../components/Logo';
import { useNavigate } from 'react-router-dom';
import { useGameStore, useUserStore } from '../../store';

export default function ChoosePlayer() {
  const nav = useNavigate();
  const avatarsRef = useRef(null);

  const scrollLeft = () => {
    if (avatarsRef.current) {
      const avatarWidth = avatarsRef.current.children[0].offsetWidth;
      const margin = parseInt(window.getComputedStyle(avatarsRef.current.children[0]).marginRight);
      const scrollAmount = avatarWidth + margin;
      avatarsRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (avatarsRef.current) {
      const avatarWidth = avatarsRef.current.children[0].offsetWidth;
      const margin = parseInt(window.getComputedStyle(avatarsRef.current.children[0]).marginRight);
      const scrollAmount = avatarWidth + margin;
      avatarsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const game = useGameStore(state => state.game);
  const setGame = useGameStore(state => state.setGame);
  const handlePlayersUpdate = useGameStore(state => state.handlePlayersUpdate);
  const [image, setImage] = useState(user.image || './boy3.png');
  const [name, setName] = useState(user.name || "player");

  console.log({user})

  const handleUpdateUser = () => {
    const updatedUser = { ...user, name: name, image: image };
    setUser(updatedUser);
    console.log({ updatedUser })

    if (game.type === "friend" && game.roomId) {
      const playersToUpdate = game.players.map(player =>
        player.id === user.id ? updatedUser : player
      );
      console.log({ playersToUpdate })
      handlePlayersUpdate(game.roomId, playersToUpdate);
      nav('/game');
    } else if (game.type === "computer") {
      setGame({
        ...game,
        players: [

        ]
      });
      nav('/game');
    }
    nav('/game');

  };

  const avatars = [
    "./boy1.png", "./girl1.png", "./boy2.png", "./girl2.png",
    "./boy3.png", "./girl3.png", "./boy4.png", "./girl4.png"
  ];

  return (
    <div className={style.container}>
      <div>
        <div className={style.title}>Your name</div>
        <div className={style.name}>
          <input type="text" placeholder={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <div className={style.avatar}>Choose avatar</div>
          <div className={style.avatars} ref={avatarsRef}>
            {avatars.map((avatarSrc, index) => (
              <img
                key={index}
                src={avatarSrc}
                alt={`Avatar ${index + 1}`}
                onClick={() => setImage(avatarSrc)}
                className={image === avatarSrc ? style.selected : ''}
              />
            ))}
          </div>
          <button className={style.right} onClick={scrollRight}>{'>'}</button>
          <button className={style.left} onClick={scrollLeft}>{'<'}</button>
          <div className={style.buttons}>
            <button onClick={() => nav(-1)}>back</button>
            <button onClick={handleUpdateUser}>send</button>
          </div>
        </div>
      </div>
    </div>
  );
}