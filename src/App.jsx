import { useState, useEffect, useRef } from 'react'
import './App.css'
import WelcomePage from './components/WelcomePage'
import GameBoard from './components/GameBoard'
import GameOver from './components/GameOver'
import CharacterSelection from './components/CharacterSelection'
import { ThirdwebProvider } from "thirdweb/react";
import { useActiveAccount } from 'thirdweb/react'
import ConnectWallet from './components/Wallet'
import SnakePreview, { snakeTypes } from './components/SnakePreview'
import { client, editionDropContract, editionDropTokenId } from '../thirdweb/contants'

function AppContent() {
  const [gameState, setGameState] = useState('welcome'); // welcome, selecting, minting, playing, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef(null);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const activeAccount = useActiveAccount();
  const [selectedSnake, setSelectedSnake] = useState(null);
  
  // Initialize the game
  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
    
    // Check if user has a minted snake
    const userSnake = localStorage.getItem(`snakeCharacter_${activeAccount?.address}`);
    if (userSnake) {
      setSelectedSnake(userSnake);
    }
  }, [activeAccount?.address]);

  const handleStartClick = () => {
    if (!activeAccount?.address) {
      setShowConnectWallet(true);
    } else {
      // Check if user has already minted a snake
      const userSnake = localStorage.getItem(`snakeCharacter_${activeAccount?.address}`);
      if (userSnake) {
        setSelectedSnake(userSnake);
        startGame();
      } else {
        // Go to character selection
        setGameState('selecting');
      }
    }
  };

  // Watch for wallet connection
  useEffect(() => {
    if (activeAccount?.address && showConnectWallet) {
      // Instead of starting game, go to character selection
      setGameState('selecting');
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

  const handleCharacterSelect = (snakeType) => {
    setSelectedSnake(snakeType);
    setGameState('minting');
  };

  const handleMintComplete = () => {
    // Save the selected snake to localStorage (simulating storage)
    localStorage.setItem(`snakeCharacter_${activeAccount?.address}`, selectedSnake);
    startGame();
  };
  
  // Add new exit game function
  const handleExitGame = () => {
    // Return to welcome screen when exiting the game
    setGameState('welcome');
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
          
          {gameState === 'selecting' && (
            <CharacterSelection 
              onSelectCharacter={handleCharacterSelect}
              walletAddress={activeAccount?.address}
            />
          )}
          
          {gameState === 'minting' && (
            <div className="minting-screen">
              <h2>Mint Your Snake NFT</h2>
              <div className="selected-snake">
                <SnakePreview 
                  primaryColor={snakeTypes.find(s => s.id === selectedSnake)?.primaryColor || '#00796b'}
                  secondaryColor={snakeTypes.find(s => s.id === selectedSnake)?.secondaryColor || '#004d40'}
                  eyeColor={snakeTypes.find(s => s.id === selectedSnake)?.eyeColor || '#ffffff'}
                  patternColor={snakeTypes.find(s => s.id === selectedSnake)?.patternColor}
                  headShape={snakeTypes.find(s => s.id === selectedSnake)?.headShape}
                />
                <h3>{snakeTypes.find(s => s.id === selectedSnake)?.name || 'Snake'}</h3>
              </div>
              <p>This snake will be minted as your NFT and used as your character in the game</p>
              <button 
                className="mint-button"
                onClick={handleMintComplete}
              >
                Mint Snake NFT
              </button>
              <button 
                className="back-button" 
                onClick={() => setGameState('selecting')}
              >
                Back to Selection
              </button>
            </div>
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
              snakeType={selectedSnake}
              onExitGame={handleExitGame} // Add this new prop for exit functionality
            />
          )}
          
          {gameState === 'gameover' && (
            <GameOver 
              score={score} 
              highScore={highScore}
              onRestart={restartGame}
              walletAddress={activeAccount?.address}
              snakeType={selectedSnake}
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
