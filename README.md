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

```ts
import { usePolling } from 'mkfolder-utils';

const fetchData = async () => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log(data);
};

const MyComponent = () => {
  usePolling(fetchData, { interval: 5000, enabled: true });
  return <div>Polling every 5 seconds...</div>;
}
```

2. `useDebounce`  
   A hook that delays updating a value until after a specified period of inactivity. Ideal for optimizing performance in search inputs, API calls, or event handlers.

```ts
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
}
```

3. `useLocalStorage`  
   A hook that synchronizes a state variable with the browser's localStorage. Persists the value across page reloads and tabs, with automatic updates.

```ts
import { useLocalStorage, useDebounce } from 'mkfolder-utils';
import { useState, useEffect } from 'react';

const MyComponent = () => {
  const [name, setName] = useLocalStorage('name', 'Alice');
  const [input, setInput] = useState<string>(name);
  const debouncedInput = useDebounce(input, 500);

  useEffect(() => {
    setName(debouncedInput);
  }, [debouncedInput]);

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <p>Debounced value (saved to localStorage): {name}</p>
    </div>
  );
};
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Contact

For questions or feedback, reach out to me: [artemii.fedotov@tutamail.com](mailto:artemii.fedotov@tutamail.com)

## License

This project is licensed under the Apache License 2.0 – see the [LICENSE](https://choosealicense.com/licenses/apache-2.0) for details.
