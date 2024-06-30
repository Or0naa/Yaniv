import React, { useEffect } from 'react';
import style from './style.module.scss';
import { useGameStore } from '../../store';
import { WhatsappIcon, WhatsappShareButton, EmailIcon, EmailShareButton } from 'react-share';
import ChoosePlayer from '../ChoosePlayer'
import { useNavigate } from 'react-router-dom';
export default function Waiting() {
  const game = useGameStore(state => state.game);
  const createGame = useGameStore(state => state.createGame)


  const shareText = `Join my game with the code: ${game.roomId}`;
  const nav = useNavigate()
  // console.log("id: ", game.roomId)
  useEffect(() => {
    if (game.numPlayers && game.players.length == game.numPlayers) {
      nav('/game')
    }
    if  (game.numPlayers && game.players.length > game.numPlayers ) {
      confirm("Error. Please enter new code.")
      nav('/create')

    }
  }, [game]);

  return (
    <div className={style.container}>
      <div>Your code is:
        <div className={style.code}>{game.roomId}</div>
      </div>
      <div className={style.share}>Share:
        <WhatsappShareButton
          url={"https://yaniv-or0naas-projects.vercel.app"} //change to website
          title={shareText}
          separator=":: "
          className={style.shareButton}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <a
          href={`sms:?&body=${encodeURIComponent(shareText)} in https://yaniv-or0naas-projects.vercel.app`}
          className={style.shareButton}
        >
          <img src="./sms.png" alt="SMS" style={{ width: 32, height: 32 }} />
        </a>
      </div>

      <div>Wait for your friends to join...</div>
      {/* <ChoosePlayer/> */}
    </div>
  );
}