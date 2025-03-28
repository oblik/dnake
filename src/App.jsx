import { useState, useEffect, useRef } from 'react'
import './App.css'
import WelcomePage from './components/WelcomePage'
import GameBoard from './components/GameBoard'
import GameOver from './components/GameOver'

function App() {
  const [gameState, setGameState] = useState('welcome'); // welcome, playing, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef(null);
  
  // Initialize the game
  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const restartGame = () => {
    setGameState('welcome');
  };

  return (
    <div className="app">
      {gameState === 'welcome' && (
        <WelcomePage onStartGame={startGame} highScore={highScore} />
      )}
      
      {gameState === 'playing' && (
        <GameBoard 
          canvasRef={canvasRef}
          score={score}
          setScore={setScore}
          highScore={highScore}
          setHighScore={setHighScore}
          setGameState={setGameState}
        />
      )}
      
      {gameState === 'gameover' && (
        <GameOver 
          score={score} 
          highScore={highScore}
          onRestart={restartGame} 
        />
      )}
    </div>
  )
}

export default App
