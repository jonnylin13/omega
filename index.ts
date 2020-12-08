import { MasterServer } from './src/server/server';

let master_server = new MasterServer(3000);
master_server.start();