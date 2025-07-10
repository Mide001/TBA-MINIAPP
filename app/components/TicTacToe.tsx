"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "./DemoComponents";

type Player = "X" | "O" | null;
type BoardState = (Player | null)[];

export function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isAITurn, setIsAITurn] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const startNewGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsAITurn(false);
    setGameResult(null);
    setWinningLine(null);
  }, []);

  const calculateWinner = (
    squares: Player[]
  ): { winner: Player; line: number[] | null } => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line };
      }
    }
    return { winner: null, line: null };
  };

  const isBoardFull = (squares: Player[]): boolean => {
    return squares.every((square) => square !== null);
  };

  const getEmptySquares = (squares: Player[]): number[] => {
    return squares
      .map((square, index) => (square === null ? index : null))
      .filter((index): index is number => index !== null);
  };

  const minimax = (
    squares: Player[],
    depth: number,
    isMaximizing: boolean
  ): number => {
    const winner = calculateWinner(squares);
    if (winner.winner === "O") return 10 - depth;
    if (winner.winner === "X") return depth - 10;
    if (isBoardFull(squares)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const index of getEmptySquares(squares)) {
        squares[index] = "O";
        const score = minimax(squares, depth + 1, false);
        squares[index] = null;
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const index of getEmptySquares(squares)) {
        squares[index] = "X";
        const score = minimax(squares, depth + 1, true);
        squares[index] = null;
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  };

  const getAIMove = (squares: Player[]): number => {
    const emptySquares = getEmptySquares(squares);
    let bestScore = -Infinity;
    let bestMove = emptySquares[0];

    for (const index of emptySquares) {
      squares[index] = "O";
      const score = minimax(squares, 0, false);
      squares[index] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    }

    return bestMove;
  };

  const handleClick = (index: number) => {
    if (
      board[index] ||
      calculateWinner(board).winner ||
      isAITurn ||
      gameResult
    )
      return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsAITurn(true);
  };

  useEffect(() => {
    if (isAITurn && !calculateWinner(board).winner && !isBoardFull(board)) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board);
        const newBoard = [...board];
        newBoard[aiMove] = "O";
        setBoard(newBoard);
        setIsAITurn(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAITurn, board]);

  useEffect(() => {
    const { winner, line } = calculateWinner(board);
    const isDraw = isBoardFull(board) && !winner;

    if (winner || isDraw) {
      let result = "";

      if (winner === "X") {
        result = "Player Won!";
      } else if (winner === "O") {
        result = "AI Won!";
      } else {
        result = "It's a Draw!";
      }

      setGameResult(result);
      setWinningLine(line);
    }
  }, [board]);

  const gameStatus =
    gameResult || (isAITurn ? "AI is thinking..." : "Your turn");

  const renderCell = (index: number) => {
    const value = board[index];
    const isWinningCell = winningLine?.includes(index);

    return (
      <div
        key={index}
        onClick={() => handleClick(index)}
        className={`
          w-20 h-20 sm:w-24 sm:h-24 
          flex items-center justify-center 
          text-3xl sm:text-4xl font-bold 
          transition-all duration-200 
          ${!value && !gameResult && !isAITurn ? 'cursor-pointer' : 'cursor-not-allowed'}
          relative
          ${value === 'X' ? 'text-blue-500' : value === 'O' ? 'text-red-500' : ''}
          ${!value && !gameResult && !isAITurn ? 'hover:bg-[var(--app-accent-light)] hover:bg-opacity-10' : ''}
          ${isWinningCell ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
        `}
      >
        {value}
      </div>
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      {/* Game Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          Tic Tac Toe vs AI
        </h2>
        <p className="text-sm text-[var(--app-foreground-muted)] mb-2">
          Challenge our unbeatable AI
        </p>
        <p className={`text-lg font-medium ${
          gameResult 
            ? "text-[var(--app-accent)]" 
            : isAITurn 
              ? "text-yellow-500" 
              : "text-[var(--app-foreground-muted)]"
        }`}>
          {gameStatus}
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
          onClick={startNewGame}
          className="flex-1 sm:flex-none"
        >
          New Game
        </Button>
        
        {gameResult && (
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              // Share game result
              const message = gameResult === "Player Won!" 
                ? "I just beat the AI in Tic Tac Toe! 🎉"
                : gameResult === "AI Won!"
                  ? "The AI beat me in Tic Tac Toe! 🤖"
                  : "I played a draw against the AI in Tic Tac Toe! 🤝";
              
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
        <p>Click a cell to make your move</p>
        <p className="mt-1">The AI is unbeatable!</p>
      </div>
    </div>
  );
} 