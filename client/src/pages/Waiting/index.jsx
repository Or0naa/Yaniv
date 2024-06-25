import React from 'react';
import style from './style.module.scss';
import CardView from '../../components/CardView';
import { useGameStore } from '../../store';
import { WhatsappIcon, WhatsappShareButton, EmailIcon, EmailShareButton } from 'react-share';
import ChoosePlayer from '../ChoosePlayer'
export default function Waiting() {
  const game = useGameStore(state => state.game);
  const shareText = `Join my game with the code: ${game.roomId}`;

  return (
    <div className={style.container}>
      <div>Your code is: {game.roomId}</div>
      <div>Share:</div>
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
        <img src="/path/to/sms-icon.png" alt="SMS" style={{ width: 32, height: 32 }} />
      </a>
      <div>Wait for your friends to join</div>
      <ChoosePlayer/>
    </div>
  );
}