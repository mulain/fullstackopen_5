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

### Playwright

```bash
npm init playwright@latest
```

course example config

```
- JS or TS? -> Javascript
- Where to put? -> tests
- Add GitHub Actions workflow -> false
- Install Playwright browsers -> true
```

Can specify specific browsers to test with in package.json

```JSON
"test": "playwright test --project=chromium --project=firefox",
```

or remove problematic browsers from playwright.config.js

```js
projects: [
    // ...
    //{
    //  name: 'webkit',
    //  use: { ...devices['Desktop Safari'] },
    //},
```

define npm script for running tests and reports in package.json

```
{
  // ...
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  },
  // ...
}
```

tests can be run via ui

```
npm run test -- --ui
```

Playwright assumes the systems being tested are up and running.
Define a script to run the backend in test mode for Playwright:

```json
{
  // ...
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development nodemon index.js",
    "build:ui": "rm -rf build && cd ../frontend/ && npm run build && cp -r build ../backend",
    "deploy": "fly deploy",
    "deploy:full": "npm run build:ui && npm run deploy",
    "logs:prod": "fly logs",
    "lint": "eslint .",
    "test": "NODE_ENV=test node --test",
    "start:test": "NODE_ENV=test node index.js" // THIS LINE
  }
  // ...
}
```

PW carries tests out for multiple browser engines. Good, but slow for the actual dev process. Define just one engine using this command:

```bash
npm test -- --project chromium
```

Probably good idea to reduce timeout as the standard timeout currrently is 30.0000 ms will cost time for failing tests. Edit playwright.config.js to contain top level variable timeout:

```
export default defineConfig({
  timeout: 3 * 1000,
```

Also useful to set fullyParallel to false if using a db (test cross contamination). Set workers to 1 to further secure non parallel testing (the preset checking for env should be removed. really just have 'workers: 1')

run flaky tests in debug mode

```
npm test -- -g'importance can be changed' --debug
```

can insert

```
await page.pause()
```

as a test break point to fast forward to

run tests in UI mode

```
npm run test -- --ui
```

Test generator to record user actions through the test interface

```
npx playwright codegen http://localhost:5173/
```
