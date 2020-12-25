# omega
v83 MapleStory Server emulator written in TypeScript. Inspired by projects like [HeavenMS](https://github.com/ronancpl/HeavenMS).

## Features
* Easy development environment
* Uses a microservice architecture where state is decoupled into center, login, shop, and channel servers
* Currently runs as a cluster of processes, with future support for running each service independently
* Advanced metrics using Prometheus
* Will support both the NX and WZ format
* Will use multithreading to delegate compute-heavy tasks
* Will use token-based authentication for intraserver communication

## Setup and contribution
* Fork the repository
* Run `npm install` in the project directory to install the dependencies

## Convention
* Class names will use PascalCase
* Filenames, functions, and variable names will use camelCase
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
    * [x] Get to login screen (handshake)
    * [x] Auto register
    * [ ] Password verification
    * [ ] Accept TOS
    * [ ] Register gender
    * [ ] Register pin
    * [ ] Pin verification
    * [ ] Select a world
    * [ ] Select a channel
    * [ ] Character list
    * [ ] Create a character
    * [ ] Register PIC
    * [ ] Select a character
    * [ ] Delete a character
    * [ ] PIC verification

### Short goals
* [ ] Server infrastructure
    * [x] Bootstrap process
    * [x] Implement CenterServer
    * [x] Implement LoginServer
    * [ ] Implement ChannelServer
    * [ ] Implement ShopServer
    * [x] Implement packet delegation
    * [x] Implement packet handling
* [x] Encryption
    * [x] Implement AES encryption
    * [x] Implement Shanda encryption
* [x] Implement packet readers/writers with Buffer
    * [x] Output classes/interfaces
    * [x] Input classes/interfaces
* [ ] Implement WZ loading
    * [ ] Parse a single WZ XML file
    * [ ] Parse a WZ directory
* [ ] Implement NX loading
    * [ ] Parse a single NX file
* [ ] Scripting engine
* [ ] Anti-cheat measures
    * [ ] Implement token authentication for intraserver communication
    * [ ] Implement multiclient check
* [x] Implement database layer
* [x] Implement logging
* [x] Implement configuration
* [x] Integrate Prometheus (performance benchmarking/metrics)

### Long goals
* [x] Design cluster system to fork worker processes
* [x] De-couple state in order to achieve micro-server architecture
* [ ] Use Redis as a memory store, and have a task to periodically update the DB
* [ ] Design worker_threads system to delegate compute-heavy tasks
* [ ] Docker support
