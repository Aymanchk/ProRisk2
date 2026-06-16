"use client";

import { createContext, useContext, useState } from "react";
import { RootStore } from "@/store/RootStore";

const StoreContext = createContext<RootStore | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Lazily create one store instance and keep it stable across re-renders.
  const [store] = useState(() => new RootStore());

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): RootStore {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within <StoreProvider>");
  }
  return store;
}
