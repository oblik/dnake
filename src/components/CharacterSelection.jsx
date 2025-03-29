import React from 'react';
import './CharacterSelection.css';
import SnakePreview, { snakeTypes } from './SnakePreview';

function CharacterSelection({ onSelectCharacter, walletAddress }) {
  return (
    <div className="character-selection-container">
      <div className="selection-header">
        <h1>Select Your Snake Character</h1>
        <p>Choose and mint a unique snake to play with in the game</p>
      </div>
      
      <div className="snake-grid">
        {snakeTypes.map(snake => (
          <div key={snake.id} className="snake-card" onClick={() => onSelectCharacter(snake.id)}>
            <div className="snake-preview-container">
              <SnakePreview 
                primaryColor={snake.primaryColor}
                secondaryColor={snake.secondaryColor}
                eyeColor={snake.eyeColor}
                patternColor={snake.patternColor}
                headShape={snake.headShape}
              />
            </div>
            <div className="snake-name">{snake.name}</div>
            <div className="snake-description">{snake.description}</div>
            <button className="select-btn">Select This Snake</button>
          </div>
        ))}
      </div>
      
      <div className="selection-footer">
        <p className="gameplay-note">The snake you mint will be your character in the game</p>
        <div className="wallet-status">
          <span className="status-dot"></span>
          Wallet Connected: {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'Not connected'}
        </div>
      </div>
    </div>
  );
}

export default CharacterSelection; 