import { CenterServer } from "./src/server/center/centerServer";
import { LoginServer } from "./src/server/login/loginServer";
import * as winston from 'winston';
import { WINSTON_FORMAT } from "./src/server/baseServer";
import * as cluster from 'cluster';
import { ShopServer } from "./src/server/shop/shopServer";

const logger = winston.createLogger({
    format: WINSTON_FORMAT,
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
        new winston.transports.Console({ level: 'debug' })
    ]
});

function getWorker(id: number) {
    return cluster.workers[id];
}
 
if (cluster.isMaster) {

    logger.debug(`Master process ${process.pid} has started`);

    const centerServer = new CenterServer();

    const loginServerProcess = cluster.fork();
    loginServerProcess.send({serverType: 1});
    const loginServerProcessId = loginServerProcess.id;

    const shopServerProcess = cluster.fork();
    shopServerProcess.send({serverType: 3});
    const shopServerProcessId = shopServerProcess.id;

    const channelServerProcessIds = [];

    for (let i = 0; i < 1; i++) {
        const channelServerProcess = cluster.fork();
        channelServerProcessIds.push(channelServerProcess.id);
        channelServerProcess.send({serverType: 2});
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.warn(`Worker process with id ${worker.process.pid} has exited with code ${code} and signal ${signal}`);
    });

} else {

    logger.debug(`Worker process ${process.pid} has started`);
    process.on('message', (message) => {
        switch(message.serverType) {
            case 1:
                new LoginServer();
                break;
            case 2:
                process.kill(process.pid);
                break;
            case 3:
                new ShopServer();
                break;
        }
    });
}
