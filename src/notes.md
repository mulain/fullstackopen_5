# Setting up tests

### Vitest and jsdom

```bash
npm install --save-dev vitest jsdom
```

### react-testing-library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### add script to package.json

```json
"scripts": {
  // ...
  "test": "vitest run"
}
```

### create testSetup.js file (here in root)

```js
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})
```

### expand vite.config.js

Includes globals so `vi`, `describe`, `test`, and `expect` do not have to be imported.  
References the `testSetup.js` file.

```js
export default defineConfig({
  // ...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  },
})
```

### fix eslint error about globals

```bash
npm install --save-dev eslint-plugin-vitest-globals
```

add to `.eslintrc.cjs`:
```js
env: {
    [...]
    "vitest-globals/env": true
  },
extends: [
    [...]
    'plugin:vitest-globals/recommended',
]
  ```

### Install user event library to simulate user input

```bash
npm install --save-dev @testing-library/user-event
```

### install test coverage

```bash
npm install @vitest/coverage-v8
```

### test functions
```js
const element = screen.getByText('Exact Text!')
``` 
will look for an exact match, not only text including the passed string.
```js
const element = await screen.findByText('Ok to have extra text.')
```
will look for text that contains the passed string

Both of these will cause an exception if they do not find a match! They cannot be used to assert that something is missing.

```js
screen.queryByText('Something that you don't expect to be found')
```

will not throw an exception and can be used for negative assertions