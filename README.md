# omega
v83 MapleStory Server emulator written in TypeScript. Based on [HeavenMS](https://github.com/ronancpl/HeavenMS)

## Project Goals
* Provide an easy development environment for beginners
* Provide a usable source for low population servers (hosting for friends)

## Setup and Contribution
* Fork the repository
* Run `npm install` in the project directory to install the dependencies

## Convention
* Function and variable names will use snake_case
* Class names will use PascalCase
* File names will use kebab-case
* Tests will be written as `*.test.ts` and placed in the `test/` directory

## Running the server
* Run the server with `npm run start`
* Run the unit tests with `npm run test`
* Build the server with `npm run build` (not necessary if running the server)

## Checklist

### Features
* [ ] There are none yet!

### Short goals
* [x] Implement custom encryption/decryption algorithms
* [x] Bootstrap master server
* [x] Write unit tests for custom encryption/decryption
* [x] Finish implementing AES encryption (needs rework)
    * [ ] Rework
    * [ ] Write unit tests
* [ ] Implement lea classes/interfaces with Buffer
    * [ ] Output classes/interfaces
    * [ ] Input classes/interfaces
    * [ ] Write unit tests
* [ ] Implement WZ loading
* [ ] Implement packet delegation/handling
* [ ] Implement login
* [ ] Implement logging

### Long goals
* [ ] Design master-child process communication to delegate compute-heavy tasks (login/cashshop/chat server?)
