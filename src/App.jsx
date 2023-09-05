import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './Header';
import Maker from './Maker';
import Player from './Player';

function App() {
  return (
    <>
    <Header />
    <Routes>
        <Route path="/" element={<Maker />} />
        <Route path="/maker" element={<Maker />} />
        <Route path="/player" element={<Player />} />
    </Routes>
    </>
  );
}

export default App;
