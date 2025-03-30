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
import {
	TransactionButton
} from "thirdweb/react";
import { useReadContract } from 'thirdweb/react'
import { claimTo, getOwnedNFTs } from "thirdweb/extensions/erc1155";

function AppContent() {
  const [gameState, setGameState] = useState('welcome'); // welcome, selecting, minting, playing, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const canvasRef = useRef(null);
  const [showConnectWallet, setShowConnectWallet] = useState(false);
  const activeAccount = useActiveAccount();
  const [selectedSnake, setSelectedSnake] = useState(null);
  const [mintingError, setMintingError] = useState('');
  const [mintingSuccess, setMintingSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  
  // const { mutate: claimNFT } = useClaimNFT(editionDropContract);
  
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

  const renderMintingError = () => (
    <div className="minting-message error">
      <p>Error: {mintingError}</p>
    </div>
  );
  
  const renderMintingSuccess = () => (
    <div className="minting-message success">
      <p>Successfully minted your Snake NFT!</p>
      <a 
        href={`https://sepolia.etherscan.io/tx/${transactionHash}`} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        View transaction
      </a>
    </div>
  );
  
  const refetchNfts = async () => {
    // Simulate refreshing NFT data
    return Promise.resolve();
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
              
              <TransactionButton
          transaction={() =>
            claimTo({
              contract: editionDropContract,
              tokenId: editionDropTokenId,
              to: activeAccount?.address,
              quantity: 1n,
            })
          }
          onError={(error) => {
            setMintingError(error.message);
            setTimeout(() => setMintingError(''), 5000);
          }}
          onTransactionConfirmed={async (result) => {
            setTransactionHash(result.transactionHash);
            setMintingSuccess(true);
            await refetchNfts();
            
            // Save the selected snake to localStorage
            localStorage.setItem(`snakeCharacter_${activeAccount?.address}`, selectedSnake);
            
            setTimeout(() => {
              setMintingSuccess(false);
              // setTransactionHash('');
              
              // Redirect to game board
              setGameState('playing');
              setScore(0);
            }, 5000);
          }}
        >
          Mint Snake NFT
        </TransactionButton>
              {mintingError && renderMintingError()}
              {mintingSuccess && renderMintingSuccess()}
              
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
