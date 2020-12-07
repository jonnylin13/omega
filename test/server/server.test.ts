import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { CenterServer } from '../../src/server/server';

describe('CenterServer test', () => {
    it('should start and stop the server', () => {
        let center_server = new CenterServer(3000);
        center_server.start();
        expect(center_server.started).equal(true);
        center_server.stop();
        expect(center_server.started).equal(false);
    });
});