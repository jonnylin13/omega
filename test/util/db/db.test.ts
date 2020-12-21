import { expect } from 'chai';
import { describe, it } from 'mocha'; 
import { DatabaseConnection } from '../../../src/util/db/db';


describe('DatabaseConnection test', () => {
    it('should initialize knex', () => {
        expect(DatabaseConnection.knex).not.equal(undefined);
    });
});