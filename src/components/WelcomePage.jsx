import React from 'react';

function WelcomePage({ onStartGame, highScore }) {
  return (
    <div className="welcome-container">
      <div className="game-title">
        <span className="letter">d</span>
        <span className="letter">s</span>
        <span className="letter">n</span>
        <span className="letter">a</span>
        <span className="letter">k</span>
        <span className="letter">e</span>
      </div>
      <p className="subtitle">Are you ready to slither?</p>
      
      <button className="start-button" onClick={onStartGame}>
        START GAME
      </button>
      
      <div className="features">
        <div className="feature">
          <span className="feature-icon">🏆</span> Beat High Scores
        </div>
        <div className="feature">
          <span className="feature-icon">🎮</span> Simple Controls
        </div>
        <div className="feature">
          <span className="feature-icon">✨</span> Exciting Challenges
        </div>
      </div>
      
      {highScore > 0 && (
        <div className="high-score">High Score: {highScore}</div>
      )}
    </div>
  );
}

export default WelcomePage;
