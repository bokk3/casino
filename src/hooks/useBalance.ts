"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";

export function useBalance() {
  const { user, refreshUser } = useAuth();
  const [balance, setBalance] = useState<number>(user?.balance || 0);
  const [isLoading, setIsLoading] = useState(false);

  // Sync local balance with user context balance initially
  useEffect(() => {
    if (user) {
      setBalance(user.balance);
    }
  }, [user]);

  const refreshBalance = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/balance");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        // Also refresh the main user context to keep them in sync
        refreshUser();
      }
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, refreshUser]);

  // Optimistic update helper
  const updateBalanceOptimistically = (newBalance: number) => {
    setBalance(newBalance);
  };

  return {
    balance,
    isLoading,
    refreshBalance,
    updateBalanceOptimistically,
  };
}
