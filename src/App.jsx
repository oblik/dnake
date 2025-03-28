import { useState, useEffect, useRef } from 'react'
import './App.css'
import WelcomePage from './components/WelcomePage'
import GameBoard from './components/GameBoard'
import GameOver from './components/GameOver'
import { ThirdwebProvider } from "thirdweb/react";
import { useActiveAccount } from 'thirdweb/react'
import ConnectWallet from './components/Wallet'

function AppContent() {
  const [gameState, setGameState] = useState('welcome'); // welcome, playing, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef(null);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const activeAccount = useActiveAccount();
  
  // Initialize the game
  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const handleStartClick = () => {
    if (!activeAccount?.address) {
      setShowConnectWallet(true);
    } else {
      startGame();
    }
  };

  // Watch for wallet connection
  useEffect(() => {
    if (activeAccount?.address && showConnectWallet) {
      startGame();
      setShowConnectWallet(false);
    }
  }, [activeAccount?.address, showConnectWallet]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const restartGame = () => {
    setGameState('welcome');
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  return (
      <div className="app-container">
        <div className="app">
          {gameState === 'welcome' && (
            <>
              {showConnectWallet ? (
                <div className="connect-wallet-screen">
                  <h2>Connect Your Wallet</h2>
                  <p>Connect your wallet to start playing</p>
                  <ConnectWallet />
                  <button 
                    className="back-button" 
                    onClick={() => setShowConnectWallet(false)}
                  >
                    Back
                  </button>
                </div>
              ) : (
                <WelcomePage 
                  onStartGame={handleStartClick} 
                  highScore={highScore}
                  walletAddress={activeAccount?.address}
                />
              )}
            </>
          )}
          
          {gameState === 'playing' && (
            <GameBoard 
              canvasRef={canvasRef}
              onGameOver={handleGameOver}
              score={score}
              setScore={setScore}
              highScore={highScore}
              setHighScore={setHighScore}
              setGameState={setGameState}
              walletAddress={activeAccount?.address}
            />
          )}
          
          {gameState === 'gameover' && (
            <GameOver 
              score={score} 
              highScore={highScore}
              onRestart={restartGame}
              walletAddress={activeAccount?.address}
            />
          )}
        </div>
      </div>
  );
}

function App() {
  return (
    <ThirdwebProvider>
      <AppContent />
    </ThirdwebProvider>
  );
}

export default App
