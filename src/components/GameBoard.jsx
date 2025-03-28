import React, { useState, useEffect, useRef } from 'react';
import { GRID_SIZE, CELL_SIZE, GAME_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT, DIRECTIONS } from './constants';
import { setupRoundRectPolyfill } from './utils';

// Setup polyfill for roundRect
setupRoundRectPolyfill();

function GameBoard({ canvasRef, score, setScore, highScore, setHighScore, setGameState, walletAddress }) {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [nextDirection, setNextDirection] = useState(DIRECTIONS.RIGHT);
  const [isPaused, setIsPaused] = useState(false);
  
  // Game state refs for use in effect callbacks
  const snakeRef = useRef(snake);
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(nextDirection);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const isPausedRef = useRef(isPaused);
  
  // Update refs when states change
  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);
  
  useEffect(() => {
    nextDirectionRef.current = nextDirection;
  }, [nextDirection]);
  
  useEffect(() => {
    foodRef.current = food;
  }, [food]);
  
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);
  
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  
  // Setup canvas once
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Adjust for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
  }, [canvasRef]);
  
  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const moveSnake = () => {
      const currentDirection = directionRef.current;
      const currentNextDirection = nextDirectionRef.current;
      const currentSnake = [...snakeRef.current];
      const currentFood = foodRef.current;
      const currentScore = scoreRef.current;
      
      // Update direction
      setDirection(currentNextDirection);
      directionRef.current = currentNextDirection;
      
      const head = { ...currentSnake[0] };
      
      head.x += currentDirection.x;
      head.y += currentDirection.y;
      
      currentSnake.unshift(head);
      
      // Check if snake eats food
      if (head.x === currentFood.x && head.y === currentFood.y) {
        setScore(currentScore + 1);
        generateFood(currentSnake);
      } else {
        currentSnake.pop();
      }
      
      setSnake(currentSnake);
      
      // Check collision
      checkCollision(head, currentSnake);
    };
    
    const checkCollision = (head, currentSnake) => {
      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver();
        return;
      }
      
      // Check self collision (start from index 1 to skip the head)
      for (let i = 1; i < currentSnake.length; i++) {
        if (head.x === currentSnake[i].x && head.y === currentSnake[i].y) {
          handleGameOver();
          return;
        }
      }
    };
    
    const drawGame = () => {
      const currentSnake = snakeRef.current;
      const currentFood = foodRef.current;
      const currentDirection = directionRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw optional grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i <= GRID_SIZE; i++) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
        
        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
        ctx.stroke();
      }
      
      // Draw snake
      ctx.fillStyle = '#ff3e3e';
      currentSnake.forEach((segment, index) => {
        ctx.beginPath();
        ctx.roundRect(
          segment.x * CELL_SIZE,
          segment.y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE,
          index === 0 ? 5 : 3  // Rounded corners (more rounded for head)
        );
        ctx.fill();
        
        // Draw eyes for the head
        if (index === 0) {
          ctx.fillStyle = '#000';
          const eyeSize = 2;
          const eyeOffset = 5;
          
          // Position eyes based on direction
          if (currentDirection === DIRECTIONS.RIGHT || currentDirection === DIRECTIONS.LEFT) {
            ctx.beginPath();
            ctx.arc(
              segment.x * CELL_SIZE + (currentDirection === DIRECTIONS.RIGHT ? CELL_SIZE - eyeOffset : eyeOffset),
              segment.y * CELL_SIZE + eyeOffset,
              eyeSize,
              0,
              Math.PI * 2
            );
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(
              segment.x * CELL_SIZE + (currentDirection === DIRECTIONS.RIGHT ? CELL_SIZE - eyeOffset : eyeOffset),
              segment.y * CELL_SIZE + CELL_SIZE - eyeOffset,
              eyeSize,
              0,
              Math.PI * 2
            );
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(
              segment.x * CELL_SIZE + eyeOffset,
              segment.y * CELL_SIZE + (currentDirection === DIRECTIONS.DOWN ? CELL_SIZE - eyeOffset : eyeOffset),
              eyeSize,
              0,
              Math.PI * 2
            );
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(
              segment.x * CELL_SIZE + CELL_SIZE - eyeOffset,
              segment.y * CELL_SIZE + (currentDirection === DIRECTIONS.DOWN ? CELL_SIZE - eyeOffset : eyeOffset),
              eyeSize,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
          
          ctx.fillStyle = '#ff3e3e'; // Reset color for next segments
        }
      });
      
      // Draw food with pulsing animation
      const pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
      const foodSize = CELL_SIZE * pulse;
      const offset = (CELL_SIZE - foodSize) / 2;
      
      ctx.fillStyle = '#88ff4d';
      ctx.beginPath();
      ctx.roundRect(
        currentFood.x * CELL_SIZE + offset,
        currentFood.y * CELL_SIZE + offset,
        foodSize,
        foodSize,
        5 // Rounded corners
      );
      ctx.fill();
    };
    
    const gameLoop = () => {
      if (!isPausedRef.current) {
        moveSnake();
        drawGame();
      }
      
      const speed = GAME_SPEED - Math.min(scoreRef.current * 3, 50);
      timeoutId = setTimeout(gameLoop, speed);
    };
    
    let timeoutId = setTimeout(gameLoop, GAME_SPEED);
    
    return () => clearTimeout(timeoutId);
  }, [canvasRef, setScore, setGameState, setHighScore]);
  
  const handleGameOver = () => {
    const currentScore = scoreRef.current;
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('snakeHighScore', currentScore.toString());
    }
    setGameState('gameover');
  };
  
  const generateFood = (currentSnake) => {
    let newFood;
    let foodOnSnake;
    
    do {
      foodOnSnake = false;
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      
      // Check if food is on the snake
      for (const segment of currentSnake) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          foodOnSnake = true;
          break;
        }
      }
    } while (foodOnSnake);
    
    setFood(newFood);
    foodRef.current = newFood;
  };
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentDirection = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDirection !== DIRECTIONS.DOWN) {
            setNextDirection(DIRECTIONS.UP);
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDirection !== DIRECTIONS.UP) {
            setNextDirection(DIRECTIONS.DOWN);
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDirection !== DIRECTIONS.RIGHT) {
            setNextDirection(DIRECTIONS.LEFT);
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDirection !== DIRECTIONS.LEFT) {
            setNextDirection(DIRECTIONS.RIGHT);
          }
          break;
        case ' ':
          setIsPaused(!isPausedRef.current);
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Handle touch controls
  useEffect(() => {
    const canvas = canvasRef.current;
    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      if (!touchStartX || !touchStartY) return;
      
      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      
      const currentDirection = directionRef.current;
      
      // Determine swipe direction based on the greatest difference
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && currentDirection !== DIRECTIONS.LEFT) {
          setNextDirection(DIRECTIONS.RIGHT);
        } else if (dx < 0 && currentDirection !== DIRECTIONS.RIGHT) {
          setNextDirection(DIRECTIONS.LEFT);
        }
      } else {
        if (dy > 0 && currentDirection !== DIRECTIONS.UP) {
          setNextDirection(DIRECTIONS.DOWN);
        } else if (dy < 0 && currentDirection !== DIRECTIONS.DOWN) {
          setNextDirection(DIRECTIONS.UP);
        }
      }
      
      // Reset touch start coordinates
      touchStartX = 0;
      touchStartY = 0;
    };
    
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [canvasRef]);
  
  return (
    <div className="game-container">
      <div className="game-header">
        <div className="score-display">Score: {score}</div>
        {walletAddress && (
          <div className="wallet-display">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        )}
      </div>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      <button 
        className="pause-button" 
        onClick={() => setIsPaused(!isPaused)}
      >
        {isPaused ? '▶' : '⏸'}
      </button>
    </div>
  );
}

export default GameBoard; 