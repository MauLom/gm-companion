import React, { useState } from 'react';

const BattleTracker = ({ battleParticipants, setBattleParticipants, characters, creatures, setCharacters }) => {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [battleStarted, setBattleStarted] = useState(false);
  const [initiativeRolled, setInitiativeRolled] = useState(false);

  // Sort participants by initiative (descending)
  const sortedParticipants = [...battleParticipants].sort((a, b) => 
    (b.rolledInitiative || 0) - (a.rolledInitiative || 0)
  );

  const rollInitiative = () => {
    const updatedParticipants = battleParticipants.map(participant => ({
      ...participant,
      rolledInitiative: Math.floor(Math.random() * 20) + 1 + (participant.initiative || 0),
      currentHitPoints: participant.currentHitPoints || participant.hitPoints
    }));
    setBattleParticipants(updatedParticipants);
    setInitiativeRolled(true);
    setCurrentTurn(0);
  };

  const startBattle = () => {
    if (!initiativeRolled) {
      rollInitiative();
    }
    setBattleStarted(true);
    setCurrentTurn(0);
    setRound(1);
  };

  const nextTurn = () => {
    if (currentTurn < sortedParticipants.length - 1) {
      setCurrentTurn(currentTurn + 1);
    } else {
      setCurrentTurn(0);
      setRound(round + 1);
    }
  };

  const previousTurn = () => {
    if (currentTurn > 0) {
      setCurrentTurn(currentTurn - 1);
    } else {
      setCurrentTurn(sortedParticipants.length - 1);
      if (round > 1) {
        setRound(round - 1);
      }
    }
  };

  const updateParticipantHP = (id, newHP) => {
    const updatedParticipants = battleParticipants.map(participant => {
      if (participant.id === id) {
        const updatedParticipant = { 
          ...participant, 
          currentHitPoints: Math.max(0, Math.min(newHP, participant.maxHitPoints || participant.hitPoints))
        };
        
        // Update corresponding character if it's a player character
        if (participant.type === 'player') {
          setCharacters(characters.map(char => 
            char.id === id ? { ...char, hitPoints: updatedParticipant.currentHitPoints } : char
          ));
        }
        
        return updatedParticipant;
      }
      return participant;
    });
    setBattleParticipants(updatedParticipants);
  };

  const updateParticipantStatus = (id, newStatus) => {
    const updatedParticipants = battleParticipants.map(participant => {
      if (participant.id === id) {
        const updatedParticipant = { ...participant, status: newStatus };
        
        // Update corresponding character if it's a player character
        if (participant.type === 'player') {
          setCharacters(characters.map(char => 
            char.id === id ? { ...char, status: newStatus } : char
          ));
        }
        
        return updatedParticipant;
      }
      return participant;
    });
    setBattleParticipants(updatedParticipants);
  };

  const removeFromBattle = (id) => {
    setBattleParticipants(battleParticipants.filter(p => p.id !== id));
  };

  const endBattle = () => {
    setBattleStarted(false);
    setInitiativeRolled(false);
    setCurrentTurn(0);
    setRound(1);
    setBattleParticipants([]);
  };

  const clearBattle = () => {
    setBattleParticipants([]);
    setBattleStarted(false);
    setInitiativeRolled(false);
    setCurrentTurn(0);
    setRound(1);
  };

  const getHealthPercentage = (current, max) => {
    return (current / max) * 100;
  };

  const getHealthStatus = (current, max) => {
    const percentage = getHealthPercentage(current, max);
    if (percentage <= 0) return 'dead';
    if (percentage <= 25) return 'critical';
    if (percentage <= 50) return 'bloodied';
    if (percentage <= 75) return 'injured';
    return 'healthy';
  };

  return (
    <div className="battle-tracker">
      <div className="battle-header">
        <h2>Battle Tracker</h2>
        <div className="battle-controls">
          {!battleStarted ? (
            <div className="pre-battle-controls">
              {!initiativeRolled && battleParticipants.length > 0 && (
                <button className="btn btn-primary" onClick={rollInitiative}>
                  Roll Initiative
                </button>
              )}
              {initiativeRolled && (
                <button className="btn btn-success" onClick={startBattle}>
                  Start Battle
                </button>
              )}
              {battleParticipants.length > 0 && (
                <button className="btn btn-secondary" onClick={clearBattle}>
                  Clear All
                </button>
              )}
            </div>
          ) : (
            <div className="battle-active-controls">
              <div className="round-info">
                <strong>Round {round}</strong>
              </div>
              <button className="btn btn-primary" onClick={previousTurn}>
                Previous Turn
              </button>
              <button className="btn btn-primary" onClick={nextTurn}>
                Next Turn
              </button>
              <button className="btn btn-danger" onClick={endBattle}>
                End Battle
              </button>
            </div>
          )}
        </div>
      </div>

      {battleParticipants.length === 0 ? (
        <div className="empty-battle">
          <p>No participants in battle. Add characters and creatures from their respective pages.</p>
        </div>
      ) : (
        <div className="participants-list">
          {sortedParticipants.map((participant, index) => (
            <div 
              key={participant.id} 
              className={`participant-card ${
                battleStarted && index === currentTurn ? 'current-turn' : ''
              } ${participant.status.toLowerCase()}`}
            >
              <div className="participant-header">
                <div className="participant-info">
                  <h3>{participant.name}</h3>
                  <span className="participant-type">
                    {participant.type === 'player' 
                      ? `Level ${participant.level} ${participant.class}` 
                      : `${participant.type} (CR ${participant.challengeRating || 'Unknown'})`
                    }
                  </span>
                </div>
                <div className="initiative-display">
                  <span className="initiative-label">Initiative:</span>
                  <span className="initiative-value">
                    {participant.rolledInitiative || 0}
                  </span>
                </div>
              </div>

              <div className="participant-stats">
                <div className="hp-section">
                  <div className="hp-controls">
                    <button 
                      className="btn btn-small btn-damage"
                      onClick={() => updateParticipantHP(
                        participant.id, 
                        (participant.currentHitPoints || participant.hitPoints) - 1
                      )}
                    >
                      -1
                    </button>
                    <button 
                      className="btn btn-small btn-damage"
                      onClick={() => updateParticipantHP(
                        participant.id, 
                        (participant.currentHitPoints || participant.hitPoints) - 5
                      )}
                    >
                      -5
                    </button>
                    <div className="hp-display">
                      <div className="hp-text">
                        {participant.currentHitPoints || participant.hitPoints} / {participant.maxHitPoints || participant.hitPoints}
                      </div>
                      <div className={`hp-bar ${getHealthStatus(
                        participant.currentHitPoints || participant.hitPoints,
                        participant.maxHitPoints || participant.hitPoints
                      )}`}>
                        <div 
                          className="hp-fill"
                          style={{ 
                            width: `${getHealthPercentage(
                              participant.currentHitPoints || participant.hitPoints,
                              participant.maxHitPoints || participant.hitPoints
                            )}%` 
                          }}
                        />
                      </div>
                    </div>
                    <button 
                      className="btn btn-small btn-heal"
                      onClick={() => updateParticipantHP(
                        participant.id, 
                        (participant.currentHitPoints || participant.hitPoints) + 1
                      )}
                    >
                      +1
                    </button>
                    <button 
                      className="btn btn-small btn-heal"
                      onClick={() => updateParticipantHP(
                        participant.id, 
                        (participant.currentHitPoints || participant.hitPoints) + 5
                      )}
                    >
                      +5
                    </button>
                  </div>
                </div>

                <div className="other-stats">
                  <div className="stat-item">
                    <strong>AC:</strong> {participant.armorClass}
                  </div>
                  <div className="status-section">
                    <label>Status:</label>
                    <select
                      value={participant.status}
                      onChange={(e) => updateParticipantStatus(participant.id, e.target.value)}
                      className={`status-select status-${participant.status.toLowerCase()}`}
                    >
                      <option value="Healthy">Healthy</option>
                      <option value="Injured">Injured</option>
                      <option value="Bloodied">Bloodied</option>
                      <option value="Unconscious">Unconscious</option>
                      <option value="Dead">Dead</option>
                      <option value="Poisoned">Poisoned</option>
                      <option value="Charmed">Charmed</option>
                      <option value="Paralyzed">Paralyzed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="participant-actions">
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => removeFromBattle(participant.id)}
                >
                  Remove
                </button>
              </div>

              {battleStarted && index === currentTurn && (
                <div className="current-turn-indicator">
                  <span>Current Turn</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BattleTracker;