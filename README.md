# omega
v83 MapleStory Server emulator written in TypeScript. Inspired by projects like [HeavenMS](https://github.com/ronancpl/HeavenMS).

## Features
* Familiar development environment
* Uses a microservice architecture where state is decoupled into center, login, shop, and channel servers
* Can be run in a cluster of processes, or each service can be run independently on a different machine
* Uses token-based authentication for intra-server communication
* Utilizes multi-threading to delegate compute-heavy tasks

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

## Client files

* Download the client files [here](https://drive.google.com/drive/folders/0BzDsHSr-0V4MYVJ0TWIxd05hYUk)

## Checklist

### Milestones
* [ ] Login
    * [ ] Get to login screen (handshake)
    * [ ] Login
    * [ ] Select a world
    * [ ] Select a channel
    * [ ] Character list
    * [ ] Create a character
    * [ ] Delete a character

### Short goals
* [ ] Bootstrap servers
    * [x] Fork processes for each server type
    * [x] Implement CenterServer
    * [x] Implement LoginServer
    * [ ] Implement ChannelServer
* [ ] Encryption
    * [x] Implementing AES encryption
        * [ ] Write unit tests
    * [x] Implement Shanda encryption
        * [ ] Write unit tests
* [x] Implement packet readers/writers with Buffer
    * [x] Output classes/interfaces
    * [ ] Write unit tests for output
    * [x] Input classes/interfaces
    * [ ] Write unit tests for input
* [ ] Implement WZ loading
    * [ ] Parse a single WZ XML file
    * [ ] Parse a WZ directory
* [x] Implement packet delegation
* [x] Implement packet handling
* [x] Implement database layer
* [x] Implement logging
* [ ] Implement configuration

### Long goals
* [x] Design cluster system to fork worker processes
* [x] De-couple state in order to achieve micro-server architecture
* [ ] Design worker_threads system to delegate compute-heavy tasks
* [ ] Docker support
* [ ] Performance benchmarking
