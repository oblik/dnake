import React from 'react';

function GameOver({ score, highScore, onRestart }) {
  return (
    <div className="gameover-container">
      <div className="gameover-modal">
        <h1 className="gameover-title">Game Over!</h1>
        <p className="final-score">Final Score: {score}</p>
        {score >= highScore && score > 0 && (
          <p className="new-high-score">New High Score!</p>
        )}
        <button className="restart-button" onClick={onRestart}>
          RESTART
        </button>
      </div>
    </div>
  );
}

export default GameOver; 