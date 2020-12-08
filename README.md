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
* [x] Finish custom encryption/decryption algorithms
* [x] Bootstrap master server
* [x] Write unit tests for custom encryption/decryption
* [x] Finish implementing AES encryption (needs rework)
* [ ] Implement lea classes/interfaces with Buffer
    * [ ] Output classes/interfaces
    * [ ] Input claseses/interfaces
* [ ] Finish WZ loading
* [ ] Fix AES encrypt method (see unit test)
* [ ] Write unit tests for AES encryption
* [ ] Add a logger
* [ ] Design master-child process communication to delegate compute-heavy tasks