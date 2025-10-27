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

import { useRef, useEffect, useState } from 'react';
import type { CallbackFn } from './types';

export enum Mode {
  CONSTANT,
  EXPONENTIAL,
}

type Status = 'idle' | 'fetching' | 'error';

interface RetryOptions {
  mode?: Mode;
  initialInterval: number;
  maxRetries?: number;
}

interface RetryResult {
  execute: () => Promise<void>;
  status: Status;
  error: Error | null;
}

/**
 * A React hook that retries a callback function with configurable backoff strategies.
 * The callback must throw an error to trigger a retry.
 *
 * @param callbackFn - Function to execute. Must throw to trigger retry.
 * @param opts - Retry configuration options
 * @param opts.initialInterval - Initial delay in milliseconds between retries
 * @param opts.mode - Backoff mode: CONSTANT (fixed delay) or EXPONENTIAL (doubling delay). Default: CONSTANT
 * @param opts.maxRetries - Maximum number of retry attempts. Default: 3
 *
 * @returns Object containing execute function, status, and error
 *
 * @example
 * ```tsx
 * import { useRetry, Mode } from './useRetry';
 *
 * function MyComponent() {
 *   const { execute, status, error } = useRetry(
 *     async () => {
 *       const response = await fetch('/api/data');
 *       if (!response.ok) throw new Error('Failed to fetch');
 *       return response.json();
 *     },
 *     {
 *       initialInterval: 1000,
 *       mode: Mode.EXPONENTIAL,
 *       maxRetries: 5
 *     }
 *   );
 *
 *   return (
 *     <div>
 *       <button onClick={execute} disabled={status === 'fetching'}>
 *         Fetch Data
 *       </button>
 *       {status === 'fetching' && <p>Loading...</p>}
 *       {status === 'error' && <p>Error: {error?.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export const useRetry = (
  callbackFn: CallbackFn,
  opts: RetryOptions
): RetryResult => {
  const savedCallback = useRef<CallbackFn>(callbackFn);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<Error | null>(null);

  const { initialInterval, maxRetries = 3 } = opts;
  const mode = opts.mode ?? Mode.CONSTANT;

  // Keep callback ref up to date
  savedCallback.current = callbackFn;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const execute = async () => {
    let attempts = 0;
    let delay = initialInterval;

    setStatus('fetching');
    setError(null);

    const attemptExecution = async (): Promise<void> => {
      try {
        await savedCallback.current();
        setStatus('idle');
      } catch (err) {
        attempts++;

        if (attempts >= maxRetries) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error);
          setStatus('error');
          throw error;
        }

        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, delay);
        });

        if (mode === Mode.EXPONENTIAL) {
          delay *= 2;
        }

        return attemptExecution();
      }
    };

    return attemptExecution();
  };

  return { execute, status, error };
};
