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

import { useEffect, useRef } from 'react';
import type { CallbackFn } from './types';

interface UsePollingOptions {
  interval: number;
  enabled: boolean;
}

/**
 * Hook for polling a callback function at a specified interval.
 *
 * @param callbackFn The function to be called at each interval. Can be (a)sync.
 * @param options.interval The polling interval in milliseconds.
 * @param options.enabled Whether polling is currently enabled.
 *
 * @example
 * // Poll an API every 5 seconds
 * usePolling(fetchData, { interval: 5000, enabled: true });
 */
export const usePolling = (callbackFn: CallbackFn, opts: UsePollingOptions) => {
  const savedCallback = useRef<CallbackFn | null>(null);
  const { enabled, interval } = opts;

  useEffect(() => {
    savedCallback.current = callbackFn;
  }, [callbackFn]);

  useEffect(() => {
    if (!enabled || interval <= 0) return;

    let isMounted = true;
    let timerId: NodeJS.Timeout;

    const executeCallback = async () => {
      if (!isMounted) return;
      try {
        await savedCallback.current?.();
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    const startPolling = () => {
      timerId = setInterval(executeCallback, interval);
    };

    startPolling();

    return () => {
      isMounted = false;
      clearInterval(timerId);
    };
  }, [interval, enabled]);
};
