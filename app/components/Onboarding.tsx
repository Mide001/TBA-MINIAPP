"use client";
import { sdk } from "@farcaster/miniapp-sdk";
import { useState, useEffect } from "react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";
import { UserProfile } from "./UserProfile";

type GameMode = "computer" | "friend" | null;
type FriendMode = "host" | "join" | null;

interface OnboardingProps {
  onGameModeSelect: (mode: GameMode, friendMode?: FriendMode) => void;
}

export function Onboarding({ onGameModeSelect }: OnboardingProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);
  const [friendMode, setFriendMode] = useState<FriendMode>(null);
  const [showFriendOptions, setShowFriendOptions] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Get user context
  useEffect(() => {
    const getUser = async () => {
      try {
        const { user } = await sdk.context;
        setUser(user);
      } catch (error) {
        console.error("Error getting user context:", error);
      }
    };
    getUser();
  }, []);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    if (mode === "computer") {
      onGameModeSelect(mode);
    } else if (mode === "friend") {
      setShowFriendOptions(true);
    }
  };

  const handleFriendModeSelect = (mode: FriendMode) => {
    setFriendMode(mode);
    onGameModeSelect("friend", mode);
  };

  const goBack = () => {
    setSelectedMode(null);
    setFriendMode(null);
    setShowFriendOptions(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-6">
      {/* User Profile */}
      {user && <UserProfile user={user} />}
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--app-accent)] to-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
            <span className="text-2xl font-bold text-white">🎮</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">
          Tic Tac Toe
        </h1>
        <p className="text-base text-[var(--app-foreground-muted)] font-medium">
          {showFriendOptions ? "Choose how to play with friend" : "Choose your game mode"}
        </p>
      </div>

      {/* Game Mode Selection */}
      {!showFriendOptions ? (
        <div className="space-y-4 mb-8">
          {/* Play with Computer */}
          <div
            className={`
              group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-200 active:scale-95
              ${selectedMode === "computer" 
                ? "border-[var(--app-accent)] bg-gradient-to-r from-[var(--app-accent-light)] to-blue-50 shadow-lg" 
                : "border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-[var(--app-accent)]"
              }
            `}
            onClick={() => handleModeSelect("computer")}
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200
                    ${selectedMode === "computer" 
                      ? "bg-gradient-to-br from-[var(--app-accent)] to-blue-600 transform scale-110" 
                      : "bg-gradient-to-br from-gray-500 to-gray-600 group-hover:from-[var(--app-accent)] group-hover:to-blue-600"
                    }
                  `}>
                    <Icon name="star" size="md" className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[var(--app-foreground)] mb-1">
                    Play with Computer
                  </h3>
                  <p className="text-sm text-[var(--app-foreground-muted)] leading-relaxed">
                    Challenge our smart computer
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-[var(--app-accent-light)] text-[var(--app-accent)] text-xs font-semibold rounded-full">
                      Smart
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                      Computer
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Icon 
                    name="arrow-right" 
                    size="md" 
                    className={`transition-all duration-200 ${
                      selectedMode === "computer" 
                        ? "text-[var(--app-accent)] transform translate-x-1" 
                        : "text-[var(--app-foreground-muted)] group-hover:text-[var(--app-accent)]"
                    }`} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Play with Friend */}
          <div
            className={`
              group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-200 active:scale-95
              ${selectedMode === "friend" 
                ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg" 
                : "border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-green-500"
              }
            `}
            onClick={() => handleModeSelect("friend")}
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200
                    ${selectedMode === "friend" 
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 transform scale-110" 
                      : "bg-gradient-to-br from-gray-500 to-gray-600 group-hover:from-green-500 group-hover:to-emerald-600"
                    }
                  `}>
                    <Icon name="heart" size="md" className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[var(--app-foreground)] mb-1">
                    Play with Friend
                  </h3>
                  <p className="text-sm text-[var(--app-foreground-muted)] leading-relaxed">
                    Online multiplayer
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                      Online
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                      Multiplayer
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Icon 
                    name="arrow-right" 
                    size="md" 
                    className={`transition-all duration-200 ${
                      selectedMode === "friend" 
                        ? "text-green-500 transform translate-x-1" 
                        : "text-[var(--app-foreground-muted)] group-hover:text-green-500"
                    }`} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Friend Mode Selection */
        <div className="space-y-4 mb-8">
          {/* Host Game */}
          <div
            className={`
              group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-200 active:scale-95
              ${friendMode === "host" 
                ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg" 
                : "border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-green-500"
              }
            `}
            onClick={() => handleFriendModeSelect("host")}
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200
                    ${friendMode === "host" 
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 transform scale-110" 
                      : "bg-gradient-to-br from-gray-500 to-gray-600 group-hover:from-green-500 group-hover:to-emerald-600"
                    }
                  `}>
                    <Icon name="plus" size="md" className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[var(--app-foreground)] mb-1">
                    Host Game
                  </h3>
                  <p className="text-sm text-[var(--app-foreground-muted)] leading-relaxed">
                    Create a new game room
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                      Create
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                      Room
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Icon 
                    name="arrow-right" 
                    size="md" 
                    className={`transition-all duration-200 ${
                      friendMode === "host" 
                        ? "text-green-500 transform translate-x-1" 
                        : "text-[var(--app-foreground-muted)] group-hover:text-green-500"
                    }`} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Join Game */}
          <div
            className={`
              group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-200 active:scale-95
              ${friendMode === "join" 
                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg" 
                : "border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-blue-500"
              }
            `}
            onClick={() => handleFriendModeSelect("join")}
          >
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200
                    ${friendMode === "join" 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 transform scale-110" 
                      : "bg-gradient-to-br from-gray-500 to-gray-600 group-hover:from-blue-500 group-hover:to-indigo-600"
                    }
                  `}>
                    <Icon name="heart" size="md" className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[var(--app-foreground)] mb-1">
                    Join Game
                  </h3>
                  <p className="text-sm text-[var(--app-foreground-muted)] leading-relaxed">
                    Enter a game room code
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                      Join
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full">
                      Room
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Icon 
                    name="arrow-right" 
                    size="md" 
                    className={`transition-all duration-200 ${
                      friendMode === "join" 
                        ? "text-blue-500 transform translate-x-1" 
                        : "text-[var(--app-foreground-muted)] group-hover:text-blue-500"
                    }`} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Game Button */}
      {(selectedMode === "computer" || friendMode) && !showFriendOptions && (
        <div className="text-center mb-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              if (selectedMode === "computer") {
                onGameModeSelect(selectedMode);
              } else if (friendMode) {
                onGameModeSelect("friend", friendMode);
              }
            }}
            className="w-full py-3 text-base font-semibold shadow-lg active:scale-95 transition-all duration-200"
          >
            🚀 Start Game
          </Button>
        </div>
      )}

      {/* Back Button for Friend Mode */}
      {showFriendOptions && (
        <div className="text-center mb-4">
          <button
            onClick={goBack}
            className="text-sm text-[var(--app-foreground-muted)] underline underline-offset-2 hover:text-[var(--app-foreground)] transition-colors duration-200"
          >
            ← Back to game modes
          </button>
        </div>
      )}

      {/* Game Info */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-2 bg-[var(--app-card-bg)] rounded-full border border-[var(--app-card-border)]">
          <span className="w-1.5 h-1.5 bg-[var(--app-accent)] rounded-full animate-pulse"></span>
          <span className="text-xs text-[var(--app-foreground-muted)] font-medium">
            {showFriendOptions ? "Choose how to play with friend" : "Select a game mode to begin"}
          </span>
        </div>
      </div>
    </div>
  );
} 