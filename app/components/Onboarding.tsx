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
    <div className="w-full max-w-sm mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--app-foreground)] mb-2">
          Tic Tac Toe
        </h1>
        <p className="text-lg text-[var(--app-foreground-muted)]">
          Choose your game mode
        </p>
      </div>

      {/* Game Mode Selection */}
      <div className="space-y-4 mb-8">
        {/* Play with Computer */}
        <div
          className={`
            p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
            ${selectedMode === "computer" 
              ? "border-[var(--app-accent)] bg-[var(--app-accent-light)] bg-opacity-20" 
              : "border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-[var(--app-accent)] hover:bg-[var(--app-accent-light)] hover:bg-opacity-10"
            }
          `}
          onClick={() => handleModeSelect("computer")}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[var(--app-accent)] rounded-lg flex items-center justify-center">
                <Icon name="star" size="lg" className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--app-foreground)] mb-1">
                Play with Computer
              </h3>
              <p className="text-sm text-[var(--app-foreground-muted)]">
                Challenge our AI opponent
              </p>
            </div>
            <div className="flex-shrink-0">
              <Icon 
                name="arrow-right" 
                size="md" 
                className={`transition-colors ${
                  selectedMode === "computer" 
                    ? "text-[var(--app-accent)]" 
                    : "text-[var(--app-foreground-muted)]"
                }`} 
              />
            </div>
          </div>
        </div>

        {/* Play with Friend */}
        <div
          className={`
            p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
            ${selectedMode === "friend" 
              ? "border-[var(--app-accent)] bg-[var(--app-accent-light)] bg-opacity-20" 
              : "border-[var(--app-card-border)] bg-[var(--app-card-bg)] hover:border-[var(--app-accent)] hover:bg-[var(--app-accent-light)] hover:bg-opacity-10"
            }
          `}
          onClick={() => handleModeSelect("friend")}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Icon name="heart" size="lg" className="text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--app-foreground)] mb-1">
                Play with Friend
              </h3>
              <p className="text-sm text-[var(--app-foreground-muted)]">
                Pass and play on the same device
              </p>
            </div>
            <div className="flex-shrink-0">
              <Icon 
                name="arrow-right" 
                size="md" 
                className={`transition-colors ${
                  selectedMode === "friend" 
                    ? "text-[var(--app-accent)]" 
                    : "text-[var(--app-foreground-muted)]"
                }`} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Start Game Button */}
      {selectedMode && (
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onGameModeSelect(selectedMode)}
            className="w-full"
          >
            Start Game
          </Button>
        </div>
      )}

      {/* Game Info */}
      <div className="mt-8 text-center text-sm text-[var(--app-foreground-muted)]">
        <p>Select a game mode to begin</p>
        <p className="mt-1">Optimized for mobile play</p>
      </div>
    </div>
  );
} 