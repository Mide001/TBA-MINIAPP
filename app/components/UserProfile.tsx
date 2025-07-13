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
    <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg sm:rounded-xl shadow-sm mb-3 sm:mb-4 touch-manipulation">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
        {user.pfpUrl && !imageError ? (
          <Image
            src={user.pfpUrl}
            alt={user.displayName || user.username || "User"}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <span className="text-lg sm:text-2xl text-gray-400">👤</span>
        )}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-semibold text-[var(--app-foreground)] truncate text-sm sm:text-base leading-tight">
          {user.displayName || "Unnamed"}
        </span>
        {user.username && (
          <span className="text-xs text-[var(--app-foreground-muted)] truncate leading-tight">
            @{user.username}
          </span>
        )}
      </div>
    </div>
  );
} 