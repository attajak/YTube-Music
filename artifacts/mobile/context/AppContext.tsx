import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppContextType {
  adBlocking: boolean;
  toggleAdBlocking: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  adBlocking: true,
  toggleAdBlocking: async () => {},
});

const STORAGE_KEY = '@ytube_ad_blocking';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [adBlocking, setAdBlocking] = useState<boolean>(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val !== null) setAdBlocking(val === 'true');
    });
  }, []);

  const toggleAdBlocking = useCallback(async () => {
    const next = !adBlocking;
    setAdBlocking(next);
    await AsyncStorage.setItem(STORAGE_KEY, String(next));
  }, [adBlocking]);

  return (
    <AppContext.Provider value={{ adBlocking, toggleAdBlocking }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
