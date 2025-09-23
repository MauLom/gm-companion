import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CharacterManager from './components/CharacterManager';
import BattleTracker from './components/BattleTracker';
import CreatureLibrary from './components/CreatureLibrary';
import './styles/App.css';

function App() {
  const [characters, setCharacters] = useState([]);
  const [creatures, setCreatures] = useState([]);
  const [battleParticipants, setBattleParticipants] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCharacters = localStorage.getItem('dnd-characters');
    const savedCreatures = localStorage.getItem('dnd-creatures');
    const savedBattle = localStorage.getItem('dnd-battle');

    if (savedCharacters) {
      setCharacters(JSON.parse(savedCharacters));
    }
    if (savedCreatures) {
      setCreatures(JSON.parse(savedCreatures));
    }
    if (savedBattle) {
      setBattleParticipants(JSON.parse(savedBattle));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('dnd-characters', JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    localStorage.setItem('dnd-creatures', JSON.stringify(creatures));
  }, [creatures]);

  useEffect(() => {
    localStorage.setItem('dnd-battle', JSON.stringify(battleParticipants));
  }, [battleParticipants]);

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>D&D GM Companion</h1>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Characters</Link></li>
            <li><Link to="/creatures">Creatures</Link></li>
            <li><Link to="/battle">Battle Tracker</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <CharacterManager 
                  characters={characters} 
                  setCharacters={setCharacters}
                  setBattleParticipants={setBattleParticipants}
                />
              } 
            />
            <Route 
              path="/creatures" 
              element={
                <CreatureLibrary 
                  creatures={creatures} 
                  setCreatures={setCreatures}
                  setBattleParticipants={setBattleParticipants}
                />
              } 
            />
            <Route 
              path="/battle" 
              element={
                <BattleTracker 
                  battleParticipants={battleParticipants}
                  setBattleParticipants={setBattleParticipants}
                  characters={characters}
                  creatures={creatures}
                  setCharacters={setCharacters}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;