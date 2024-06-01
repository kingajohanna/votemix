import { useState } from "react";

export const useLocalStorage = (keyName: string, defaultValue?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(
          keyName,
          JSON.stringify(defaultValue.toLowerCase())
        );
        return defaultValue.toLowerCase();
      }
    } catch (err) {
      return defaultValue.toLowerCase();
    }
  });
  const setValue = (newValue: any) => {
    try {
      window.localStorage.setItem(
        keyName,
        JSON.stringify(newValue.toLowerCase())
      );
    } catch (err) {
      console.log(err);
    }
    setStoredValue(newValue.toLowerCase());
  };
  return [storedValue, setValue];
};
