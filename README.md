# omega
v83 MapleStory Server emulator written in TypeScript. Inspired by projects like [HeavenMS](https://github.com/ronancpl/HeavenMS), though I plan on removing a lot of "bloat" and creating more of a general framework that I can build off of.

## Project goals
* Provide an easy development environment for beginners
* Provide a usable source for low population servers (hosting for friends)
* Squeeze as much performance as I can with Node.js

## Setup and contribution
* Fork the repository
* Run `npm install` in the project directory to install the dependencies

## Convention
* Class names will use PascalCase
* Filenames, function, and variable names will use camelCase
* SQL tables and columns will use snake_case
* Tests will be written as `*.test.ts` and placed in the `test/` directory

## Running the server
* Run the server with `npm run start`
* Run the unit tests with `npm run test`
* Build the server with `npm run build` (not necessary if running the server)

## Client files

* Download the client files [here](https://drive.google.com/drive/folders/0BzDsHSr-0V4MYVJ0TWIxd05hYUk)

## Checklist

### Milestones
* [ ] Login
    * [x] Get to login screen (handshake)
    * [ ] Login
    * [ ] Select a world
    * [ ] Select a channel
    * [ ] Character list
    * [ ] Create a character
    * [ ] Delete a character

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
* [x] Implement packet delegation
    * [ ] Register login packet handlers
* [ ] Implement packet handling
    * [ ] Login
    * [ ] Character list/select
* [x] Implement database layer
* [x] Implement logging

### Long goals
* [ ] Design worker_threads system to fork worker threads (will introduce race conditions)
* [ ] Design cluster system to increase throughput (probably unnecessary)
* [ ] De-couple state in order to achieve micro-server architecture
* [ ] Docker support
* [ ] Performance benchmarking
