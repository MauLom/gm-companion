import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CharacterManager = ({ characters, setCharacters, setBattleParticipants }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    level: 1,
    hitPoints: 0,
    maxHitPoints: 0,
    armorClass: 10,
    initiative: 0,
    status: 'Healthy'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const characterData = {
      ...formData,
      id: editingCharacter ? editingCharacter.id : uuidv4(),
      level: parseInt(formData.level),
      hitPoints: parseInt(formData.hitPoints),
      maxHitPoints: parseInt(formData.maxHitPoints),
      armorClass: parseInt(formData.armorClass),
      initiative: parseInt(formData.initiative),
      type: 'player'
    };

    if (editingCharacter) {
      setCharacters(characters.map(char => 
        char.id === editingCharacter.id ? characterData : char
      ));
    } else {
      setCharacters([...characters, characterData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      class: '',
      level: 1,
      hitPoints: 0,
      maxHitPoints: 0,
      armorClass: 10,
      initiative: 0,
      status: 'Healthy'
    });
    setShowForm(false);
    setEditingCharacter(null);
  };

  const editCharacter = (character) => {
    setFormData(character);
    setEditingCharacter(character);
    setShowForm(true);
  };

  const deleteCharacter = (id) => {
    setCharacters(characters.filter(char => char.id !== id));
  };

  const addToBattle = (character) => {
    setBattleParticipants(prev => {
      const exists = prev.find(p => p.id === character.id);
      if (!exists) {
        return [...prev, { ...character, currentHitPoints: character.hitPoints }];
      }
      return prev;
    });
  };

  const updateHitPoints = (id, newHitPoints) => {
    setCharacters(characters.map(char => 
      char.id === id ? { ...char, hitPoints: Math.max(0, Math.min(newHitPoints, char.maxHitPoints)) } : char
    ));
  };

  const updateStatus = (id, newStatus) => {
    setCharacters(characters.map(char => 
      char.id === id ? { ...char, status: newStatus } : char
    ));
  };

  return (
    <div className="character-manager">
      <div className="section-header">
        <h2>Player Characters</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Character'}
        </button>
      </div>

      {showForm && (
        <form className="character-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Class:</label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Level:</label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                min="1"
                max="20"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Hit Points:</label>
              <input
                type="number"
                name="hitPoints"
                value={formData.hitPoints}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Max Hit Points:</label>
              <input
                type="number"
                name="maxHitPoints"
                value={formData.maxHitPoints}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>Armor Class:</label>
              <input
                type="number"
                name="armorClass"
                value={formData.armorClass}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Initiative Modifier:</label>
              <input
                type="number"
                name="initiative"
                value={formData.initiative}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
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

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingCharacter ? 'Update Character' : 'Add Character'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="characters-grid">
        {characters.map(character => (
          <div key={character.id} className="character-card">
            <div className="character-header">
              <h3>{character.name}</h3>
              <span className="character-class">Level {character.level} {character.class}</span>
            </div>
            
            <div className="character-stats">
              <div className="stat-group">
                <label>Hit Points:</label>
                <div className="hp-controls">
                  <button 
                    className="btn btn-small"
                    onClick={() => updateHitPoints(character.id, character.hitPoints - 1)}
                  >
                    -
                  </button>
                  <span className="hp-display">
                    {character.hitPoints} / {character.maxHitPoints}
                  </span>
                  <button 
                    className="btn btn-small"
                    onClick={() => updateHitPoints(character.id, character.hitPoints + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="stat-item">
                <strong>AC:</strong> {character.armorClass}
              </div>
              <div className="stat-item">
                <strong>Initiative:</strong> {character.initiative >= 0 ? '+' : ''}{character.initiative}
              </div>
            </div>

            <div className="character-status">
              <label>Status:</label>
              <select
                value={character.status}
                onChange={(e) => updateStatus(character.id, e.target.value)}
                className={`status-select status-${character.status.toLowerCase()}`}
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

            <div className="character-actions">
              <button 
                className="btn btn-primary btn-small"
                onClick={() => addToBattle(character)}
              >
                Add to Battle
              </button>
              <button 
                className="btn btn-secondary btn-small"
                onClick={() => editCharacter(character)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger btn-small"
                onClick={() => deleteCharacter(character.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {characters.length === 0 && (
        <div className="empty-state">
          <p>No characters created yet. Add your first player character!</p>
        </div>
      )}
    </div>
  );
};

export default CharacterManager;