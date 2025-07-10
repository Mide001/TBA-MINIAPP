"use client";

import { useState, useCallback } from "react";
import { Button } from "./DemoComponents";

type Player = "X" | "O";
type BoardState = (Player | null)[];
type GameStatus = "playing" | "won" | "draw";

export function TicTacToe() {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [winner, setWinner] = useState<Player | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // Winning combinations
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkWinner = useCallback((boardState: BoardState): Player | null => {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return boardState[a];
      }
    }
    return null;
  }, []);

  const checkDraw = useCallback((boardState: BoardState): boolean => {
    return boardState.every(cell => cell !== null);
  }, []);

  // AI Logic - Minimax with Alpha-Beta Pruning
  const getAvailableMoves = useCallback((boardState: BoardState): number[] => {
    return boardState.map((cell, index) => cell === null ? index : -1).filter(index => index !== -1);
  }, []);

  const minimax = useCallback((boardState: BoardState, depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
    const winner = checkWinner(boardState);
    const isDraw = checkDraw(boardState);

    // Terminal states
    if (winner === "O") return 10 - depth; // AI wins
    if (winner === "X") return depth - 10; // Player wins
    if (isDraw) return 0; // Draw

    const availableMoves = getAvailableMoves(boardState);
    
    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of availableMoves) {
        const newBoard = [...boardState];
        newBoard[move] = "O";
        const evaluation = minimax(newBoard, depth + 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of availableMoves) {
        const newBoard = [...boardState];
        newBoard[move] = "X";
        const evaluation = minimax(newBoard, depth + 1, alpha, beta, true);
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minEval;
    }
  }, [checkWinner, checkDraw, getAvailableMoves]);

  const getBestMove = useCallback((boardState: BoardState): number => {
    const availableMoves = getAvailableMoves(boardState);
    let bestMove = -1;
    let bestValue = -Infinity;

    for (const move of availableMoves) {
      const newBoard = [...boardState];
      newBoard[move] = "O";
      const value = minimax(newBoard, 0, -Infinity, Infinity, false);
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }

    return bestMove;
  }, [getAvailableMoves, minimax]);

  const handleCellClick = useCallback((index: number) => {
    if (board[index] || gameStatus !== "playing" || currentPlayer !== "X") return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
      setGameStatus("won");
    } else if (checkDraw(newBoard)) {
      setGameStatus("draw");
    } else {
      setCurrentPlayer("O");
      // AI's turn
      setIsThinking(true);
      setTimeout(() => {
        const aiMove = getBestMove(newBoard);
        if (aiMove !== -1) {
          const aiBoard = [...newBoard];
          aiBoard[aiMove] = "O";
          setBoard(aiBoard);

          const aiWinner = checkWinner(aiBoard);
          if (aiWinner) {
            setWinner(aiWinner);
            setGameStatus("won");
          } else if (checkDraw(aiBoard)) {
            setGameStatus("draw");
          } else {
            setCurrentPlayer("X");
          }
        }
        setIsThinking(false);
      }, 500); // Small delay to show AI is thinking
    }
  }, [board, currentPlayer, gameStatus, checkWinner, checkDraw, getBestMove]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setGameStatus("playing");
    setWinner(null);
  }, []);

  const renderCell = (index: number) => {
    const value = board[index];
    const isWinningCell = winner && winningCombos.some(combo => 
      combo.includes(index) && combo.every(i => board[i] === winner)
    );

    // Find the winning combination for line positioning
    const winningCombo = winner ? winningCombos.find(combo => 
      combo.every(i => board[i] === winner)
    ) : null;

    const getLineClass = () => {
      if (!winningCombo || !winningCombo.includes(index)) return '';
      
      const lineColor = winner === 'X' ? 'after:bg-blue-500' : 'after:bg-red-500';
      
      // Determine line direction based on winning combination
      if (winningCombo.includes(0) && winningCombo.includes(1) && winningCombo.includes(2)) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-2 after:right-2 after:h-0.5 ${lineColor} after:transform after:-translate-y-1/2`; // Horizontal top row
      } else if (winningCombo.includes(3) && winningCombo.includes(4) && winningCombo.includes(5)) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-2 after:right-2 after:h-0.5 ${lineColor} after:transform after:-translate-y-1/2`; // Horizontal middle row
      } else if (winningCombo.includes(6) && winningCombo.includes(7) && winningCombo.includes(8)) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-2 after:right-2 after:h-0.5 ${lineColor} after:transform after:-translate-y-1/2`; // Horizontal bottom row
      } else if (winningCombo.includes(0) && winningCombo.includes(3) && winningCombo.includes(6)) {
        return `after:content-[""] after:absolute after:left-1/2 after:top-2 after:bottom-2 after:w-0.5 ${lineColor} after:transform after:-translate-x-1/2`; // Vertical left column
      } else if (winningCombo.includes(1) && winningCombo.includes(4) && winningCombo.includes(7)) {
        return `after:content-[""] after:absolute after:left-1/2 after:top-2 after:bottom-2 after:w-0.5 ${lineColor} after:transform after:-translate-x-1/2`; // Vertical middle column
      } else if (winningCombo.includes(2) && winningCombo.includes(5) && winningCombo.includes(8)) {
        return `after:content-[""] after:absolute after:left-1/2 after:top-2 after:bottom-2 after:w-0.5 ${lineColor} after:transform after:-translate-x-1/2`; // Vertical right column
      } else if (winningCombo.includes(0) && winningCombo.includes(4) && winningCombo.includes(8)) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-4 after:right-4 after:h-0.5 ${lineColor} after:transform after:rotate-45 after:scale-x-150`; // Diagonal top-left to bottom-right
      } else if (winningCombo.includes(2) && winningCombo.includes(4) && winningCombo.includes(6)) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-4 after:right-4 after:h-0.5 ${lineColor} after:transform after:-rotate-45 after:scale-x-150`; // Diagonal top-right to bottom-left
      }
      return '';
    };

    return (
      <div
        key={index}
        onClick={() => handleCellClick(index)}
        className={`
          w-20 h-20 sm:w-24 sm:h-24 
          flex items-center justify-center 
          text-3xl sm:text-4xl font-bold 
          transition-all duration-200 
          ${!value && gameStatus === "playing" && !isThinking ? 'cursor-pointer' : 'cursor-not-allowed'}
          relative
          ${value === 'X' ? 'text-blue-500' : value === 'O' ? 'text-red-500' : ''}
          ${!value && gameStatus === "playing" && !isThinking ? 'hover:bg-[var(--app-accent-light)] hover:bg-opacity-10' : ''}
          ${getLineClass()}
        `}
      >
        {value}
      </div>
    );
  };

  const getStatusMessage = () => {
    if (gameStatus === "won") {
      return `Player ${winner} wins!`;
    } else if (gameStatus === "draw") {
      return "It's a draw!";
    } else if (isThinking) {
      return "AI is thinking...";
    } else {
      return `Player ${currentPlayer}'s turn`;
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      {/* Game Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          Tic Tac Toe
        </h2>
        <p className={`text-lg font-medium ${
          gameStatus === "playing" 
            ? "text-[var(--app-foreground-muted)]" 
            : gameStatus === "won" 
              ? "text-[var(--app-accent)]" 
              : "text-yellow-500"
        }`}>
          {getStatusMessage()}
        </p>
      </div>

      {/* Main Game Board Container */}
      <div className="flex justify-center items-center mb-6">
        <div className="p-4">
          {/* Game Board */}
          <div className="grid grid-cols-3 gap-0 border-2 border-[var(--app-card-border)] border-opacity-50 rounded-lg overflow-hidden">
            {Array(9).fill(null).map((_, index) => (
              <div
                key={index}
                className={`
                  ${index % 3 !== 2 ? 'border-r border-[var(--app-card-border)] border-opacity-30' : ''}
                  ${index < 6 ? 'border-b border-[var(--app-card-border)] border-opacity-30' : ''}
                `}
              >
                {renderCell(index)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="primary"
          size="md"
          onClick={resetGame}
          className="flex-1 sm:flex-none"
        >
          New Game
        </Button>
        
        {gameStatus !== "playing" && (
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              // Share game result
              const message = gameStatus === "won" 
                ? `I just won Tic Tac Toe as player ${winner}! 🎉`
                : "I just played a draw in Tic Tac Toe! 🤝";
              
              if (navigator.share) {
                navigator.share({
                  title: 'Tic Tac Toe Result',
                  text: message,
                  url: window.location.href
                });
              } else {
                // Fallback to copying to clipboard
                navigator.clipboard.writeText(message);
              }
            }}
            className="flex-1 sm:flex-none"
          >
            Share Result
          </Button>
        )}
      </div>

      {/* Game Stats */}
      <div className="mt-6 text-center text-sm text-[var(--app-foreground-muted)]">
        <p>Tap a cell to make your move</p>
      </div>
    </div>
  );
} 