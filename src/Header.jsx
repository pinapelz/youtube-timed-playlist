import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [activeView, setActiveView] = useState('maker'); // 'maker' is the default active view
  const location = useLocation();

  const handleToggleView = () => {
    setActiveView((prevView) => (prevView === 'maker' ? 'player' : 'maker'));
  };

  return (
    <header className="bg-blue-500 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                to="/maker"
                className={activeView === 'maker' ? 'font-bold' : ''}
                onClick={() => setActiveView('maker')}
              >
                Maker
              </Link>
            </li>
            <li>
              <Link
                to="/player"
                className={activeView === 'player' ? 'font-bold' : ''}
                onClick={() => setActiveView('player')}
              >
                Player
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
