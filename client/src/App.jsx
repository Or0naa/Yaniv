import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { socket } from './socket'; // ייבוא של אובייקט הסוקט
import Popup from './components/Popup';
import Welcome from "./pages/Welcome";
import Waiting from './pages/Waiting';
import Board from './pages/Board';
import ChoosePlayer from './pages/ChoosePlayer';
import { useGameStore, useUserStore } from './store';
import Logo from './components/Logo';

const App = () => {
  const [backgroundImage, setBackgroundImage] = useState('./14.png');

  useEffect(() => {
    socket.on('backgroundUpdate', (newImageUrl) => {
      setBackgroundImage(newImageUrl);
    });

    return () => {
      socket.off('backgroundUpdate');
    };
  }, []);

  const router = createBrowserRouter([
    { path: '/', element: <Welcome /> },
    { path: '/game', element: <Board /> },
    { path: '/create', element: <Waiting /> },
    { path: '/choose', element: <ChoosePlayer /> }
  ]);

  const handlePlayersUpdate = useGameStore(state => state.handlePlayersUpdate);
  const socketBoardUpdate = useGameStore(state => state.socketBoardUpdate);
  const addId = useUserStore(state => state.addId);

  useEffect(() => {
    handlePlayersUpdate();
    socketBoardUpdate();
    addId();
  }, [handlePlayersUpdate, socketBoardUpdate, addId]);

  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <RouterProvider router={router} />
      <Popup />
    </div>
  );
};

export default App;