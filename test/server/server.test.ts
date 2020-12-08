import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { MasterServer } from '../../src/server/server';

describe('MasterServer test', () => {
    it('should start and stop the server', () => {
        let center_server = new MasterServer(3000);
        center_server.start();
        expect(center_server.started).equal(true);
        center_server.stop();
        expect(center_server.started).equal(false);
    });
});