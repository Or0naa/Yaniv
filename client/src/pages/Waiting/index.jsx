import React from 'react';
import style from './style.module.scss';
import { useGameStore } from '../../store';
import { WhatsappIcon, WhatsappShareButton, EmailIcon, EmailShareButton } from 'react-share';
import ChoosePlayer from '../ChoosePlayer'
export default function Waiting() {
  const game = useGameStore(state => state.game);
  const shareText = `Join my game with the code: ${game.roomId}`;

  console.log("id: ", game.roomId)

  return (
    <div className={style.container}>
      <div>Your code is:
        <div className={style.code}>{game.roomId}</div> 
         </div>
      <div className={style.share}>Share:
      <WhatsappShareButton
        url={window.location.href} //change to website
        title={shareText}
        separator=":: "
        className={style.shareButton}
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <a
        href={`sms:?&body=${encodeURIComponent(shareText)}`}
        className={style.shareButton}
      >
        <img src="./sms.png" alt="SMS" style={{ width: 32, height: 32 }} />
      </a>
      </div>
      <div>Wait for your friends to join</div>
      <ChoosePlayer/>
    </div>
  );
}