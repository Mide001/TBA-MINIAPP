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

  const handleCellClick = useCallback((index: number) => {
    if (board[index] || gameStatus !== "playing") return;

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
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }, [board, currentPlayer, gameStatus, checkWinner, checkDraw]);

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

    return (
      <button
        key={index}
        onClick={() => handleCellClick(index)}
        disabled={value !== null || gameStatus !== "playing"}
        className={`
          w-20 h-20 sm:w-24 sm:h-24 
          border-2 border-[var(--app-card-border)] 
          bg-[var(--app-card-bg)] 
          flex items-center justify-center 
          text-3xl sm:text-4xl font-bold 
          transition-all duration-200 
          hover:bg-[var(--app-accent-light)] 
          disabled:cursor-not-allowed
          ${value ? 'cursor-default' : 'cursor-pointer'}
          ${isWinningCell ? 'bg-[var(--app-accent)] text-[var(--app-background)]' : ''}
          ${value === 'X' ? 'text-blue-500' : value === 'O' ? 'text-red-500' : ''}
        `}
      >
        {value}
      </button>
    );
  };

  const getStatusMessage = () => {
    if (gameStatus === "won") {
      return `Player ${winner} wins!`;
    } else if (gameStatus === "draw") {
      return "It's a draw!";
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

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {Array(9).fill(null).map((_, index) => renderCell(index))}
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
        <p className="mt-1">Optimized for mobile play</p>
      </div>
    </div>
  );
} 