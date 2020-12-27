import { expect } from 'chai';
import { it, describe } from 'mocha';
import { Config } from '../../src/util/config';


describe('util/config.ts', () => {
    it('should load the config', () => {
        expect(Config.instance).to.not.equal(undefined);
    });

    it('should read a config property correctly', () => {
        expect(Config.instance.login.port).to.equal(8484);
    });
});