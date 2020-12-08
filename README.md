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

## Running the server
* Run the server with `npm run start`
* Run the unit tests with `npm run test`
* Build the server with `npm run build` (not necessary if running the server)

## Checklist
* [x] Finish custom encryption/decryption algorithms
* [x] Write unit tests for custom encryption/decryption
* [x] Finish implementing AES encryption
* [ ] Fix AES encrypt method (see unit test)
* [ ] Write unit tests for AES encryption
* [ ] Add a logger
* [ ] Think of a solution for performance (use child processes?)