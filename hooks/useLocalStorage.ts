/*
 * mkfolder-utils
 * Collection of common React hooks and utilities for everyday development
 * Repository: https://github.com/Makefolder/react-utils
 *
 * Copyright 2025 Artemii Fedotov <artemii.fedotov@tutamail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useState } from 'react';

type StorageSetter<T> = (value: T | ((val: T) => T)) => void;

/**
 * A hook that persists a state value in localStorage and syncs across tabs.
 * Mimics the API of React's useState, but with automatic persistence.
 *
 * @template T The type of the state value.
 * @param key The key under which the value is stored in localStorage.
 * @param initialValue The initial value to use if localStorage does not contain the key.
 * @returns {[T, StorageSetter<T>]} A stateful value and a function to update it, just like useState.
 *
 * @example
 * // Persist a string value in localStorage
 * const [name, setName] = useLocalStorage<string>('name', 'Alice');
 *
 * @example
 * // Persist an object value in localStorage
 * const [user, setUser] = useLocalStorage<User>('user', { name: 'Alice', age: 30 });
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, StorageSetter<T>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          console.error(error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
};
