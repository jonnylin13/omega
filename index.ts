import { MasterServer } from './src/net/server/server';

let master_server = MasterServer.get_instance();
master_server.start();