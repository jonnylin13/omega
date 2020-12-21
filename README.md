# omega
v83 MapleStory Server emulator written in TypeScript. Based on [HeavenMS](https://github.com/ronancpl/HeavenMS)

## Project goals
* Provide an easy development environment for beginners
* Provide a usable source for low population servers (hosting for friends)

## Setup and contribution
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

## Client files

* Download the client files [here](https://drive.google.com/drive/folders/0BzDsHSr-0V4MYVJ0TWIxd05hYUk)

## Checklist

### Features
* [ ] None yet... stay tuned!

### Short goals
* [x] Implement Maple custom encryption algorithms
* [x] Bootstrap master server
* [x] Write unit tests for custom encryption/decryption
* [x] Finish implementing AES encryption (needs rework)
    * [ ] Rework
    * [ ] Write unit tests
* [x] Implement lea classes/interfaces with Buffer
    * [x] Output classes/interfaces
    * [x] Write unit tests for output
    * [x] Input classes/interfaces
    * [x] Write unit tests for input
* [x] Implement WZ loading (might need rework)
    * [x] Parse a single WZ XML file
    * [x] Parse a WZ directory
* [ ] Implement packet delegation
* [ ] Implement packet handling
    * [ ] Login
    * [ ] Character list/select
* [x] Implement database layer
* [ ] Implement logging

### Long goals
* [ ] Design worker_threads system to delegate compute-heavy tasks
* [ ] Design cluster system to fork login servers, channel servers, cash shop server, etc
* [ ] Docker support
