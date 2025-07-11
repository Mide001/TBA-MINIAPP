"use client";

import {
  useMiniKit,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
// Unused imports removed
import { useEffect, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { TicTacToe } from "./components/TicTacToe";
import { TicTacToeFriend } from "./components/TicTacToeFriend";
import { Onboarding } from "./components/Onboarding";

export default function App() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const [gameMode, setGameMode] = useState<"computer" | "friend" | null>(null);
  const [friendMode, setFriendMode] = useState<"host" | "join" | null>(null);
  const [rounds, setRounds] = useState<number>(3);

  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleGameModeSelect = useCallback(
    (mode: "computer" | "friend" | null, mode2?: "host" | "join" | null, roundsParam?: number) => {
      setGameMode(mode);
      setFriendMode(mode2 || null);
      if (roundsParam) {
        setRounds(roundsParam);
      }
    },
    [],
  );

  // saveFrameButton removed - unused

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <main className="flex-1">
          {!gameMode ? (
            <Onboarding onGameModeSelect={handleGameModeSelect} />
          ) : gameMode === "computer" ? (
            <TicTacToe />
          ) : (
            <TicTacToeFriend mode={friendMode} rounds={rounds} />
          )}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
