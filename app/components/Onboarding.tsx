"use client";

import { useState } from "react";
import { Button } from "./DemoComponents";
import { Icon } from "./DemoComponents";

type GameMode = "computer" | "friend" | null;

interface OnboardingProps {
  onGameModeSelect: (mode: GameMode) => void;
}

export function Onboarding({ onGameModeSelect }: OnboardingProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    onGameModeSelect(mode);
  };

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
          Choose your game mode
        </p>
      </div>

      {/* Game Mode Selection */}
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
                  Pass and play on same device
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                    Local
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

      {/* Start Game Button */}
      {selectedMode && (
        <div className="text-center mb-6">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onGameModeSelect(selectedMode)}
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
            Select a game mode to begin
          </span>
        </div>
      </div>
    </div>
  );
} 