# D&D GM Companion

A React-based web application designed to help Dungeon Masters manage D&D campaigns, track characters, creatures, and battles.

![Application Screenshot](https://github.com/user-attachments/assets/e59a2270-68ce-4c89-ae56-36b8a21c8234)

## Features

### 📜 Character Management
- Create and manage player characters with full stats
- Track hit points, armor class, initiative modifiers
- Monitor character status effects (healthy, injured, poisoned, etc.)
- Real-time HP adjustment with visual feedback

### 🐉 Creature Library
- Build a library of monsters and NPCs
- Full ability score tracking with automatic modifier calculation
- Challenge rating support (CR 0 to CR 30)
- Comprehensive stat management (HP, AC, Initiative)

### ⚔️ Battle Tracker
- Initiative rolling and turn management
- Visual health bars with color-coded status
- Round tracking with turn navigation
- Real-time damage/healing during combat
- Status effect management during battles

![Battle in Progress](https://github.com/user-attachments/assets/5fabbee2-103a-4c47-a94c-3c838e1779f9)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MauLom/gm-companion.git
cd gm-companion
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Managing Characters
1. Navigate to the **Characters** tab
2. Click **"Add Character"** to create a new player character
3. Fill in the character details (name, class, level, stats)
4. Use the **HP controls** to adjust health during gameplay
5. Update **status effects** as needed
6. Click **"Add to Battle"** to include in combat encounters

### Building Creature Library
1. Go to the **Creatures** tab
2. Click **"Add Creature"** to create monsters/NPCs
3. Set creature type and challenge rating
4. Configure ability scores (modifiers calculated automatically)
5. Save creatures for reuse in multiple encounters

### Running Battles
1. Add participants from Characters and Creatures pages
2. Navigate to **Battle Tracker**
3. Click **"Roll Initiative"** to determine turn order
4. Click **"Start Battle"** to begin combat
5. Use **damage/healing buttons** to adjust HP during fights
6. Navigate turns with **Previous/Next Turn** buttons
7. Monitor **visual health bars** and **status effects**

## Technical Features

- **React 18** with functional components and hooks
- **React Router** for navigation
- **Local Storage** persistence (data survives page refreshes)
- **Responsive design** (works on mobile and desktop)
- **Real-time calculations** (ability modifiers, health percentages)
- **Visual feedback** (health bars, turn indicators, status colors)

## Data Persistence

All data is automatically saved to your browser's local storage:
- Characters persist between sessions
- Creature library is maintained
- Battle state is preserved during combat

## Future Enhancements

- D&D Beyond API integration for importing official character data
- Dice rolling system with damage calculations
- Spell tracking and management
- Campaign session notes
- Character sheet export/import
- Multi-party battle support

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License.