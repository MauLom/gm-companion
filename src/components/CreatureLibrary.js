import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CreatureLibrary = ({ creatures, setCreatures, setBattleParticipants }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCreature, setEditingCreature] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    challengeRating: '1/4',
    hitPoints: 0,
    maxHitPoints: 0,
    armorClass: 10,
    initiative: 0,
    status: 'Healthy',
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    }
  });

  const crOptions = ['0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('abilities.')) {
      const abilityName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        abilities: {
          ...prev.abilities,
          [abilityName]: parseInt(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const creatureData = {
      ...formData,
      id: editingCreature ? editingCreature.id : uuidv4(),
      hitPoints: parseInt(formData.hitPoints),
      maxHitPoints: parseInt(formData.maxHitPoints),
      armorClass: parseInt(formData.armorClass),
      initiative: parseInt(formData.initiative),
      type: 'creature'
    };

    if (editingCreature) {
      setCreatures(creatures.map(creature => 
        creature.id === editingCreature.id ? creatureData : creature
      ));
    } else {
      setCreatures([...creatures, creatureData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      challengeRating: '1/4',
      hitPoints: 0,
      maxHitPoints: 0,
      armorClass: 10,
      initiative: 0,
      status: 'Healthy',
      abilities: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      }
    });
    setShowForm(false);
    setEditingCreature(null);
  };

  const editCreature = (creature) => {
    setFormData(creature);
    setEditingCreature(creature);
    setShowForm(true);
  };

  const deleteCreature = (id) => {
    setCreatures(creatures.filter(creature => creature.id !== id));
  };

  const addToBattle = (creature) => {
    setBattleParticipants(prev => {
      const newCreature = { 
        ...creature, 
        id: uuidv4(), // Give each instance a unique ID
        currentHitPoints: creature.hitPoints,
        name: `${creature.name} #${prev.filter(p => p.name.startsWith(creature.name)).length + 1}`
      };
      return [...prev, newCreature];
    });
  };

  const getAbilityModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  const formatModifier = (modifier) => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <div className="creature-library">
      <div className="section-header">
        <h2>Creature Library</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Creature'}
        </button>
      </div>

      {showForm && (
        <form className="creature-form" onSubmit={handleSubmit}>
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
              <label>Type:</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="e.g., Beast, Humanoid, Dragon"
                required
              />
            </div>
            <div className="form-group">
              <label>Challenge Rating:</label>
              <select
                name="challengeRating"
                value={formData.challengeRating}
                onChange={handleInputChange}
                required
              >
                {crOptions.map(cr => (
                  <option key={cr} value={cr}>CR {cr}</option>
                ))}
              </select>
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
                min="1"
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

          <div className="abilities-section">
            <h4>Ability Scores</h4>
            <div className="abilities-grid">
              {Object.entries(formData.abilities).map(([ability, score]) => (
                <div key={ability} className="form-group">
                  <label>{ability.charAt(0).toUpperCase() + ability.slice(1)}:</label>
                  <input
                    type="number"
                    name={`abilities.${ability}`}
                    value={score}
                    onChange={handleInputChange}
                    min="1"
                    max="30"
                  />
                  <span className="modifier">
                    ({formatModifier(getAbilityModifier(score))})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingCreature ? 'Update Creature' : 'Add Creature'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="creatures-grid">
        {creatures.map(creature => (
          <div key={creature.id} className="creature-card">
            <div className="creature-header">
              <h3>{creature.name}</h3>
              <div className="creature-meta">
                <span className="creature-type">{creature.type}</span>
                <span className="challenge-rating">CR {creature.challengeRating}</span>
              </div>
            </div>
            
            <div className="creature-stats">
              <div className="stat-row">
                <div className="stat-item">
                  <strong>HP:</strong> {creature.hitPoints} / {creature.maxHitPoints}
                </div>
                <div className="stat-item">
                  <strong>AC:</strong> {creature.armorClass}
                </div>
                <div className="stat-item">
                  <strong>Init:</strong> {formatModifier(creature.initiative)}
                </div>
              </div>
              
              <div className="abilities-display">
                {Object.entries(creature.abilities).map(([ability, score]) => (
                  <div key={ability} className="ability-stat">
                    <div className="ability-name">{ability.slice(0, 3).toUpperCase()}</div>
                    <div className="ability-score">{score}</div>
                    <div className="ability-modifier">
                      {formatModifier(getAbilityModifier(score))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="creature-status">
              <span className={`status-badge status-${creature.status.toLowerCase()}`}>
                {creature.status}
              </span>
            </div>

            <div className="creature-actions">
              <button 
                className="btn btn-primary btn-small"
                onClick={() => addToBattle(creature)}
              >
                Add to Battle
              </button>
              <button 
                className="btn btn-secondary btn-small"
                onClick={() => editCreature(creature)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger btn-small"
                onClick={() => deleteCreature(creature.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {creatures.length === 0 && (
        <div className="empty-state">
          <p>No creatures in your library yet. Add monsters and NPCs to populate your encounters!</p>
        </div>
      )}
    </div>
  );
};

export default CreatureLibrary;