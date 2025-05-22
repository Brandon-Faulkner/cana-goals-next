"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeSavingState } from "@/lib/saving-state-controller";

const SavingStateContext = createContext({
  savingState: { isSaving: false, hasError: false },
});

export const SavingStateProvider = ({ children }) => {
  const [savingState, setState] = useState({
    isSaving: false,
    hasError: false,
  });

  useEffect(() => {
    const unsubscribe = subscribeSavingState(setState);
    return () => unsubscribe();
  }, []);

  return (
    <SavingStateContext.Provider value={{ savingState }}>
      {children}
    </SavingStateContext.Provider>
  );
};

export const useSavingState = () => {
  const ctx = useContext(SavingStateContext);
  if (!ctx)
    throw new Error("useSavingState must be used within SavingStateProvider");
  return ctx;
};
