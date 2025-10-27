# MKfolder-utils

**A collection of common React hooks and utilities for everyday development.**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/mkfolder-utils.svg)](https://badge.fury.io/js/mkfolder-utils)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/Makefolder/react-utils)

---

## Features

- **Custom React Hooks**: Ready-to-use hooks for common tasks.
- **TypeScript Support**: Fully typed for better developer experience.
- **Lightweight**: Minimal dependencies, focused on utility.
- **Future Plans**: TSX components and utility scripts.

---

## Installation

Install the package via npm:

```bash
npm install mkfolder-utils
```

## Usage

1. `usePolling`  
   A hook that repeatedly executes a callback function at a specified interval. Useful for fetching real-time updates, monitoring changes, or refreshing data periodically.

```tsx
import { usePolling } from 'mkfolder-utils';

const fetchData = async () => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
};

const MyComponent = () => {
  usePolling(fetchData, { interval: 5000, enabled: true });
  return <div>Polling every 5 seconds...</div>;
};
```

2. `useDebounce`  
   A hook that delays updating a value until after a specified period of inactivity. Ideal for optimizing performance in search inputs, API calls, or event handlers.

```tsx
import { useState, useEffect } from 'react';
import { useDebounce } from 'mkfolder-utils';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Perform API call or expensive operation here
    console.log('Debounced search term:', debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

3. `useLocalStorage`  
   A hook that synchronizes a state variable with the browser's localStorage. Persists the value across page reloads and tabs, with automatic updates.

```tsx
import { useLocalStorage } from 'mkfolder-utils';

const MyComponent = () => {
  //                                              key     default value
  const [name, setName] = useLocalStorage<string>('name', 'Alice');

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <p>Debounced value (saved to localStorage): {name}</p>
    </div>
  );
};
```

4. `useRetry`
   A hook that automatically retries failed operations with configurable backoff strategies. Perfect for handling flaky API calls or unreliable network requests. Provides status tracking for UI feedback.

**Modes:**

- `Mode.CONSTANT` - Fixed delay between retries (default)
- `Mode.EXPONENTIAL` - Exponential backoff (delay doubles each time)

```tsx
import { useRetry, Mode } from 'mkfolder-utils';

const MyComponent = () => {
  const { execute, status, error } = useRetry(
    async () => {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    {
      initialInterval: 1000,      // Wait 1s between retries
      mode: Mode.EXPONENTIAL,     // Double delay each retry (1s, 2s, 4s...)
      maxRetries: 5               // Give up after 5 attempts
    }
  );

  return (
    <div>
      <button onClick={execute} disabled={status === 'fetching'}>
        Fetch Data
      </button>
      <div>{status === 'fetching' && Loading...}</div>
      <div>{status === 'error' && Error: {error?.message}}</div>
    </div>
  );
};
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the Apache License 2.0 – see the [LICENSE](https://choosealicense.com/licenses/apache-2.0) for details.
