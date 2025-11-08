import { useState, useEffect } from 'react';


export function usePersistentState<T>(storageKey: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (err) {
      console.warn(`No se pudo leer la clave "${storageKey}" de localStorage`, err);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (err) {
      console.warn(`No se pudo guardar la clave "${storageKey}" en localStorage`, err);
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}
