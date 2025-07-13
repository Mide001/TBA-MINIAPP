import React, { useState } from "react";
import Image from "next/image";

interface UserProfileProps {
  user: {
    pfpUrl?: string;
    displayName?: string;
    username?: string;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-xl shadow-sm mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {user.pfpUrl && !imageError ? (
          <Image
            src={user.pfpUrl}
            alt={user.displayName || user.username || "User"}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-2xl text-gray-400">👤</span>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-[var(--app-foreground)] truncate">
          {user.displayName || "Unnamed"}
        </span>
        {user.username && (
          <span className="text-xs text-[var(--app-foreground-muted)] truncate">
            @{user.username}
          </span>
        )}
      </div>
    </div>
  );
} 