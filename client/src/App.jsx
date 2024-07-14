import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { socket } from './helpers/socket'; // ייבוא של אובייקט הסוקט
import Popup from './components/Popup';
import Welcome from "./pages/Welcome";
import Waiting from './pages/Waiting';
import Board from './pages/Board';
import ChoosePlayer from './pages/ChoosePlayer';
import { useGameStore, useUserStore } from './store';
import Logo from './components/Logo';
import OpenPage from './pages/OpenPage';
import Create from './pages/Create';
import Layout from './Layout';

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
    { path: '/', element: <OpenPage /> },

    {
      element: <Layout />,
      children: [
        { path: '/welcome', element: <Welcome /> },
        { path: '/game', element: <Board /> },
        { path: '/create', element: <Create /> },
        { path: '/waiting', element: <Waiting /> },
        { path: '/choose', element: <ChoosePlayer /> }]
    }
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