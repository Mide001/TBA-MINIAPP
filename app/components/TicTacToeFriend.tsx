"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";
import { io, Socket } from "socket.io-client";

type Player = "X" | "O";
type BoardState = (Player | null)[];
type GameStatus = "waiting" | "playing" | "won" | "draw" | "game-over";
type ConnectionStatus = "disconnected" | "hosting" | "joining" | "connected";

interface TicTacToeFriendProps {
  mode: "host" | "join" | null;
}

export function TicTacToeFriend({ mode }: TicTacToeFriendProps) {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  // currentPlayer state removed - unused
  const [gameStatus, setGameStatus] = useState<GameStatus>("waiting");
  const [winner, setWinner] = useState<Player | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [roomCode, setRoomCode] = useState<string>("");
  const [inputCode, setInputCode] = useState<string>("");
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  const [myPlayer, setMyPlayer] = useState<Player>("X");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  // Scoreboard state removed - using roundScores instead
  // Rounds system state
  const [totalRounds, setTotalRounds] = useState<number>(3);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [roundScores, setRoundScores] = useState<{
    host: number;
    guest: number;
  }>({ host: 0, guest: 0 });
  const [gameWinner, setGameWinner] = useState<Player | undefined>(undefined);
  const [showRoundsSelection, setShowRoundsSelection] =
    useState<boolean>(false);
  // Add startingPlayer state
  const [startingPlayer, setStartingPlayer] = useState<Player>("X");
  const moveSoundRef = useRef<HTMLAudioElement | null>(null);
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Play sound function that doesn't block UI
  const playMoveSound = useCallback(() => {
    if (moveSoundRef.current) {
      try {
        // Use requestAnimationFrame to ensure it doesn't block the UI
        requestAnimationFrame(() => {
          if (moveSoundRef.current) {
            moveSoundRef.current.currentTime = 0;
            moveSoundRef.current.play().catch((error) => {
              console.warn("Failed to play sound:", error);
            });
          }
        });
      } catch (error) {
        console.warn("Error playing sound:", error);
      }
    }
  }, []);

  // Generate a random 6-character room code
  const generateRoomCode = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    // https://tba-miniapp-server-production.up.railway.app
    const newSocket = io("https://tba-miniapp-server-production.up.railway.app", {
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsConnected(true);
      setSocket(newSocket);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    newSocket.on("room-created", (room) => {
      console.log("Room created:", room);
      setConnectionStatus("hosting");
      setGameStatus("waiting");
      // Initialize rounds data from room
      if (room.totalRounds) {
        setTotalRounds(room.totalRounds);
      }
      if (room.roundScores) {
        setRoundScores(room.roundScores);
      }
      if (room.currentRound) {
        setCurrentRound(room.currentRound);
      }
      if (room.startingPlayer) {
        setStartingPlayer(room.startingPlayer);
      }
    });

    newSocket.on("player-joined", (room) => {
      console.log("Player joined:", room);
      setBoard(room.board);
      setGameStatus(room.gameStatus);
      setWinner(room.winner || null);
      setConnectionStatus("connected");
      setIsMyTurn(room.currentPlayer === myPlayer);
      // Initialize rounds data from room
      if (room.totalRounds) {
        setTotalRounds(room.totalRounds);
      }
      if (room.roundScores) {
        setRoundScores(room.roundScores);
      }
      if (room.currentRound) {
        setCurrentRound(room.currentRound);
      }
      if (room.startingPlayer) {
        setStartingPlayer(room.startingPlayer);
      }
    });

    newSocket.on("move-made", (room) => {
      console.log("Move made:", room);
      // Play sound using the optimized function
      playMoveSound();
      setBoard(room.board);
      setGameStatus(room.gameStatus);
      setWinner(room.winner || null);
      setIsMyTurn(room.currentPlayer === myPlayer);
      // Update round scores
      if (room.roundScores) {
        setRoundScores(room.roundScores);
      }
      if (room.currentRound) {
        setCurrentRound(room.currentRound);
      }
      // Check for game winner
      if (room.gameWinner) {
        setGameWinner(room.gameWinner);
      }
      // Score updates handled by backend roundScores
      if (room.startingPlayer) {
        setStartingPlayer(room.startingPlayer);
      }
    });

    newSocket.on("game-reset", (room) => {
      console.log("Game reset:", room);
      setBoard(room.board);
      setGameStatus(room.gameStatus);
      setWinner(null);
      setIsMyTurn(room.currentPlayer === myPlayer);
      // Update rounds data
      if (room.currentRound) {
        setCurrentRound(room.currentRound);
      }
      if (room.roundScores) {
        setRoundScores(room.roundScores);
      }
      if (room.gameWinner) {
        setGameWinner(room.gameWinner);
      }
      if (room.startingPlayer) {
        setStartingPlayer(room.startingPlayer);
      }
    });

    newSocket.on("player-left", (room) => {
      console.log("Player left:", room);
      setGameStatus("waiting");
      setConnectionStatus("hosting");
    });

    newSocket.on("room-error", (error) => {
      console.error("Room error:", error);
      alert(error.message);
    });

    newSocket.on("move-error", (error) => {
      console.error("Move error:", error);
      alert(error.message);
    });

    return () => {
      newSocket.close();
    };
  }, [myPlayer, playMoveSound]);

  // Initialize audio element
  useEffect(() => {
    if (moveSoundRef.current) {
      const audio = moveSoundRef.current;

      const handleError = () => {
        console.warn("Audio failed to load");
      };

      audio.addEventListener("error", handleError);

      // Try to load the audio
      audio.load();

      return () => {
        audio.removeEventListener("error", handleError);
      };
    }
  }, []);

  // Initialize hosting or joining
  useEffect(() => {
    if (!socket || !isConnected) return;

    if (mode === "host") {
      const code = generateRoomCode();
      setRoomCode(code);
      setMyPlayer("X");
      setShowRoundsSelection(true);
    } else if (mode === "join") {
      setConnectionStatus("joining");
      setMyPlayer("O");
    }
  }, [mode, socket, isConnected, generateRoomCode]);

  // Winning combinations
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  // checkWinner function removed - unused

  // checkDraw function removed - unused

  const handleCellClick = useCallback(
    (index: number) => {
      if (board[index] || gameStatus !== "playing" || !isMyTurn || !socket)
        return;

      socket.emit("make-move", {
        roomId: roomCode,
        index,
        player: myPlayer,
      });
    },
    [board, gameStatus, isMyTurn, socket, roomCode, myPlayer],
  );

  const handleJoinGame = useCallback(() => {
    if (inputCode.length === 6 && socket) {
      setRoomCode(inputCode);
      socket.emit("join-room", inputCode);
    }
  }, [inputCode, socket]);

  const copyRoomCode = useCallback(() => {
    navigator.clipboard.writeText(roomCode);
    setCodeCopied(true);
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCodeCopied(false);
    }, 2000);
  }, [roomCode]);

  const resetGame = useCallback(() => {
    // Additional validation to prevent unauthorized resets
    if (
      !socket ||
      currentRound >= totalRounds ||
      gameStatus === "playing" ||
      (gameStatus !== "won" && gameStatus !== "draw")
    ) {
      console.warn("Reset game blocked - invalid conditions");
      return;
    }
    socket.emit("reset-game", roomCode);
  }, [socket, roomCode, currentRound, totalRounds, gameStatus]);

  const createRoom = useCallback(() => {
    if (socket) {
      socket.emit("create-room", { roomId: roomCode, totalRounds });
      setShowRoundsSelection(false);
    }
  }, [socket, roomCode, totalRounds]);

  const renderCell = (index: number) => {
    const value = board[index];

    // Find the winning combination for line positioning
    const winningCombo = winner
      ? winningCombos.find((combo) => combo.every((i) => board[i] === winner))
      : null;

    const getLineClass = () => {
      if (!winningCombo || !winningCombo.includes(index)) return "";

      const lineColor =
        winner === "X" ? "after:bg-blue-500" : "after:bg-red-500";

      // Determine line direction based on winning combination
      if (
        winningCombo.includes(0) &&
        winningCombo.includes(1) &&
        winningCombo.includes(2)
      ) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-2 after:right-2 after:h-0.5 ${lineColor} after:transform after:-translate-y-1/2`; // Horizontal top row
      } else if (
        winningCombo.includes(3) &&
        winningCombo.includes(4) &&
        winningCombo.includes(5)
      ) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-2 after:right-2 after:h-0.5 ${lineColor} after:transform after:-translate-y-1/2`; // Horizontal middle row
      } else if (
        winningCombo.includes(6) &&
        winningCombo.includes(7) &&
        winningCombo.includes(8)
      ) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-2 after:right-2 after:h-0.5 ${lineColor} after:transform after:-translate-y-1/2`; // Horizontal bottom row
      } else if (
        winningCombo.includes(0) &&
        winningCombo.includes(3) &&
        winningCombo.includes(6)
      ) {
        return `after:content-[""] after:absolute after:left-1/2 after:top-2 after:bottom-2 after:w-0.5 ${lineColor} after:transform after:-translate-x-1/2`; // Vertical left column
      } else if (
        winningCombo.includes(1) &&
        winningCombo.includes(4) &&
        winningCombo.includes(7)
      ) {
        return `after:content-[""] after:absolute after:left-1/2 after:top-2 after:bottom-2 after:w-0.5 ${lineColor} after:transform after:-translate-x-1/2`; // Vertical middle column
      } else if (
        winningCombo.includes(2) &&
        winningCombo.includes(5) &&
        winningCombo.includes(8)
      ) {
        return `after:content-[""] after:absolute after:left-1/2 after:top-2 after:bottom-2 after:w-0.5 ${lineColor} after:transform after:-translate-x-1/2`; // Vertical right column
      } else if (
        winningCombo.includes(0) &&
        winningCombo.includes(4) &&
        winningCombo.includes(8)
      ) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-4 after:right-4 after:h-0.5 ${lineColor} after:transform after:rotate-45 after:scale-x-150`; // Diagonal top-left to bottom-right
      } else if (
        winningCombo.includes(2) &&
        winningCombo.includes(4) &&
        winningCombo.includes(6)
      ) {
        return `after:content-[""] after:absolute after:top-1/2 after:left-4 after:right-4 after:h-0.5 ${lineColor} after:transform after:-rotate-45 after:scale-x-150`; // Diagonal top-right to bottom-left
      }
      return "";
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
          ${!value && gameStatus === "playing" && isMyTurn ? "cursor-pointer" : "cursor-not-allowed"}
          relative
          ${value === "X" ? "text-blue-500" : value === "O" ? "text-red-500" : ""}
          ${!value && gameStatus === "playing" && isMyTurn ? "hover:bg-[var(--app-accent-light)] hover:bg-opacity-10" : ""}
          ${getLineClass()}
        `}
      >
        {value}
      </div>
    );
  };

  const getStatusMessage = () => {
    // Debug logging
    console.log("Status Debug:", {
      gameWinner,
      gameStatus,
      winner,
      myPlayer,
      roundScores
    });
    
    // Check if game is over based on scores
    const roundsNeededToWin = Math.ceil(totalRounds / 2);
    const hostWins = roundScores.host;
    const guestWins = roundScores.guest;
    const gameIsOver = hostWins >= roundsNeededToWin || guestWins >= roundsNeededToWin;
    
    if (gameWinner || gameStatus === "game-over" || gameIsOver) {
      const actualWinner = gameWinner || (hostWins > guestWins ? "X" : "O");
      return actualWinner === myPlayer
        ? "You won the game!"
        : "Opponent won the game!";
    } else if (gameStatus === "won" || winner) {
      const winnerLabel = winner === myPlayer ? "You Won!" : "Opponent Won!";
      return winnerLabel;
    } else if (gameStatus === "draw") {
      return "It's a draw!";
    } else if (gameStatus === "waiting") {
      if (connectionStatus === "hosting") {
        return "Waiting for player to join...";
      } else if (connectionStatus === "joining") {
        return "Enter room code to join";
      } else {
        return "Connected! Waiting for game to start...";
      }
    } else {
      return isMyTurn ? "Your turn" : "Opponent's turn";
    }
  };

  // Render rounds selection for host
  if (showRoundsSelection) {
    return (
      <div className="w-full max-w-sm mx-auto p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
            Configure Game
          </h2>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-4">
            Select the number of rounds to play
          </p>
        </div>

        {/* Rounds Selection */}
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-6 mb-6">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-[var(--app-foreground-muted)] mb-3 uppercase tracking-wide">
              Number of Rounds
            </h3>
            <div className="flex justify-center space-x-2 mb-4">
              {[3, 5, 7].map((rounds) => (
                <button
                  key={rounds}
                  onClick={() => setTotalRounds(rounds)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    totalRounds === rounds
                      ? "bg-[var(--app-accent)] text-white border-[var(--app-accent)]"
                      : "bg-transparent border-[var(--app-card-border)] text-[var(--app-foreground)] hover:border-[var(--app-accent)]"
                  }`}
                >
                  Best of {rounds}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--app-foreground-muted)]">
              First to win {(totalRounds + 1) / 2} rounds wins the game
            </p>
          </div>
        </div>

        {/* Create Room Button */}
        <div className="text-center">
          <Button
            variant="primary"
            size="md"
            onClick={createRoom}
            className="w-full"
          >
            Create Room
          </Button>
        </div>
      </div>
    );
  }

  // Render room code section for host
  if (connectionStatus === "hosting" && gameStatus === "waiting") {
    return (
      <div className="w-full max-w-sm mx-auto p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
            Host Game
          </h2>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-4">
            Share this code with your friend
          </p>
        </div>

        {/* Game Info */}
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-4 mb-4">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-[var(--app-foreground-muted)] mb-2 uppercase tracking-wide">
              Game Settings
            </h3>
            <p className="text-lg font-bold text-[var(--app-accent)]">
              Best of {totalRounds}
            </p>
          </div>
        </div>

        {/* Room Code Display */}
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-6 mb-6">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-[var(--app-foreground-muted)] mb-3 uppercase tracking-wide">
              Room Code
            </h3>
            <div className="text-4xl font-bold text-[var(--app-accent)] mb-4 tracking-wider">
              {roomCode}
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={copyRoomCode}
              className="w-full"
              disabled={codeCopied}
            >
              <Icon name="check" size="sm" className="mr-2" />
              {codeCopied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">
              Waiting for player to join...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Render join game section
  if (connectionStatus === "joining") {
    return (
      <div className="w-full max-w-sm mx-auto p-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
            Join Game
          </h2>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-4">
            Enter the room code from your friend
          </p>
        </div>

        {/* Room Code Input */}
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-6 mb-6">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-[var(--app-foreground-muted)] mb-3 uppercase tracking-wide">
              Room Code
            </h3>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full text-center text-2xl font-bold text-[var(--app-accent)] tracking-wider bg-transparent border-b-2 border-[var(--app-card-border)] focus:border-[var(--app-accent)] outline-none py-2 mb-4"
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleJoinGame}
              disabled={inputCode.length !== 6}
              className="w-full"
            >
              Join Game
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-[var(--app-foreground-muted)]">
          <p>Ask your friend for the 6-digit room code</p>
        </div>
      </div>
    );
  }

  // Render the actual game board or connecting state
  if (connectionStatus === "disconnected") {
    // Show a styled connecting state
    return (
      <div className="w-full max-w-sm mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-8 h-8 border-4 border-[var(--app-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="text-xl font-bold text-[var(--app-foreground)] mb-2">
            Connecting…
          </h2>
          <p className="text-sm text-[var(--app-foreground-muted)]">
            Establishing connection to server…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      {/* Game Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          Tic Tac Toe{" "}
          {mode === "host" ? "(Host)" : mode === "join" ? "(Join)" : ""}
        </h2>
        <p className="text-sm text-[var(--app-foreground-muted)] mb-2">
          Room: {roomCode} • Round {currentRound} of {totalRounds}
        </p>

        {gameWinner && (
          <p className="text-lg font-bold text-[var(--app-accent)] mb-2">
            {gameWinner === myPlayer
              ? "You won the game!"
              : "Opponent won the game!"}
          </p>
        )}
        <p
          className={`text-lg font-medium ${
            gameStatus === "playing"
              ? isMyTurn
                ? "text-[var(--app-accent)]"
                : "text-[var(--app-foreground-muted)]"
              : gameStatus === "won"
                ? "text-[var(--app-accent)]"
                : "text-yellow-500"
          }`}
        >
          {getStatusMessage()}
        </p>
      </div>

      {/* Round Scores */}
      <div className="mb-4">
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-2">
          <div className="text-center mb-1">
            <h3 className="text-xs font-semibold text-[var(--app-foreground-muted)] uppercase tracking-wide">
              Round Scores
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">
                {roundScores.host}
              </div>
              <div className="text-xs text-[var(--app-foreground-muted)]">
                Host
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">
                {roundScores.guest}
              </div>
              <div className="text-xs text-[var(--app-foreground-muted)]">
                Guest
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Board Container */}
      <div className="flex justify-center items-center mb-6">
        <div className="p-4">
          {/* Game Board */}
          <div className="grid grid-cols-3 gap-0 border-2 border-[var(--app-card-border)] border-opacity-50 rounded-lg overflow-hidden">
            {Array(9)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className={`
                  ${index % 3 !== 2 ? "border-r border-[var(--app-card-border)] border-opacity-30" : ""}
                  ${index < 6 ? "border-b border-[var(--app-card-border)] border-opacity-30" : ""}
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
          disabled={
            !!gameWinner ||
            currentRound >= totalRounds ||
            gameStatus === "playing" ||
            gameStatus === "waiting" ||
            !isConnected ||
            (gameStatus !== "won" && gameStatus !== "draw")
          }
        >
          {gameWinner ? "Game Over" : "Next Round"}
        </Button>

        {gameWinner && (
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              // Share total results
              const message = `Tic Tac Toe results:\nHost: ${roundScores.host}\nGuest: ${roundScores.guest}\nRounds: ${totalRounds}\nWinner: ${gameWinner === "X" ? "Host" : "Guest"}`;
              if (navigator.share) {
                navigator.share({
                  title: "Tic Tac Toe Results",
                  text: message,
                  url: window.location.href,
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
        <p>
          You are playing as:{" "}
          <span className="font-semibold text-[var(--app-accent)]">
            Player {myPlayer}
          </span>
        </p>
        <p className="text-xs text-[var(--app-foreground-muted)] mb-1">
          Starting Player: {startingPlayer === myPlayer ? "You" : "Opponent"}
        </p>
      </div>
      <audio ref={moveSoundRef} src="/move.mp3" preload="auto" />
    </div>
  );
}
