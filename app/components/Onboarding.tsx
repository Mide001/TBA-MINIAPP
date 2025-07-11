"use client";

import { useState } from "react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";

type GameMode = "computer" | "friend" | null;
type FriendMode = "host" | "join" | null;

interface OnboardingProps {
  onGameModeSelect: (mode: GameMode, friendMode?: FriendMode, rounds?: number) => void;
}

export function Onboarding({ onGameModeSelect }: OnboardingProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);
  const [friendMode, setFriendMode] = useState<FriendMode>(null);
  const [showFriendOptions, setShowFriendOptions] = useState(false);
  const [showRoundsSelection, setShowRoundsSelection] = useState(false);
  const [selectedRounds, setSelectedRounds] = useState<number>(3);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    if (mode === "computer") {
      onGameModeSelect(mode);
    } else if (mode === "friend") {
      setShowFriendOptions(true);
    }
  };

  const handleRoundsSelect = (rounds: number) => {
    setSelectedRounds(rounds);
    setShowRoundsSelection(false);
    onGameModeSelect("friend", "host", rounds);
  };

  const handleFriendModeSelect = (mode: FriendMode) => {
    setFriendMode(mode);
    if (mode === "host") {
      // Host needs to select rounds first
      setShowFriendOptions(false);
      setShowRoundsSelection(true);
    } else if (mode === "join") {
      // Guest doesn't select rounds - they join whatever the host set
      onGameModeSelect("friend", mode, undefined);
    }
  };

  const goBack = () => {
    if (showRoundsSelection) {
      setShowRoundsSelection(false);
      setShowFriendOptions(true);
    } else if (showFriendOptions) {
      setShowFriendOptions(false);
      setSelectedMode(null);
    } else {
      setSelectedMode(null);
      setFriendMode(null);
      setShowFriendOptions(false);
      setShowRoundsSelection(false);
    }
  };

  const getCurrentStepTitle = () => {
    if (showRoundsSelection) return "Select number of rounds";
    if (showFriendOptions) return "Choose how to play with friend";
    return "Choose your game mode";
  };

  const roundsOptions = [1, 3, 5, 7, 9];

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-6">
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
          {getCurrentStepTitle()}
        </p>
      </div>

      {/* Back Button */}
      {(showFriendOptions || showRoundsSelection) && (
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
          >
            ← Back
          </Button>
        </div>
      )}

      {/* Rounds Selection - Only for Host */}
      {showRoundsSelection ? (
        <div className="space-y-4 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-[var(--app-foreground)] mb-2">
              How many rounds?
            </h2>
            <p className="text-sm text-[var(--app-foreground-muted)]">
              First to win {selectedRounds} rounds wins the match
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {roundsOptions.map((rounds) => (
              <div
                key={rounds}
                className={`
                  group relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-200 active:scale-95 p-4 text-center
                  ${selectedRounds === rounds 
                    ? "border-[var(--app-accent)] bg-gradient-to-r from-[var(--app-accent-light)] to-blue-50 shadow-lg" 
                    : "border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-[var(--app-accent)]"
                  }
                `}
                onClick={() => handleRoundsSelect(rounds)}
              >
                <div className="text-2xl font-bold text-[var(--app-foreground)] mb-1">
                  {rounds}
                </div>
                <div className="text-xs text-[var(--app-foreground-muted)]">
                  {rounds === 1 ? "Round" : "Rounds"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !showFriendOptions ? (
        /* Game Mode Selection */
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
                    Create a room and invite your friend
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                      Best of {selectedRounds}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                      Host
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
                ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg" 
                : "border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-green-500"
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
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 transform scale-110" 
                      : "bg-gradient-to-br from-gray-500 to-gray-600 group-hover:from-green-500 group-hover:to-emerald-600"
                    }
                  `}>
                    <Icon name="check" size="md" className="text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[var(--app-foreground)] mb-1">
                    Join Game
                  </h3>
                  <p className="text-sm text-[var(--app-foreground-muted)] leading-relaxed">
                    Join your friend&apos;s room with a code
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                      Join Room
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                      Guest
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Icon 
                    name="arrow-right" 
                    size="md" 
                    className={`transition-all duration-200 ${
                      friendMode === "join" 
                        ? "text-green-500 transform translate-x-1" 
                        : "text-[var(--app-foreground-muted)] group-hover:text-green-500"
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
                onGameModeSelect("friend", friendMode, selectedRounds);
              }
            }}
            className="w-full py-3 text-base font-semibold shadow-lg active:scale-95 transition-all duration-200"
          >
            🚀 Start Game
          </Button>
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