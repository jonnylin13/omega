import { MasterServer } from './src/server/server';

let master_server = MasterServer.get_instance();
master_server.start();