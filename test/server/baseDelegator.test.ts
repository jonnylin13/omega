import { expect } from 'chai';
import { it, describe } from 'mocha';
import { PacketDelegator } from '../../src/server/baseDelegator';
import { PacketHandler } from '../../src/server/baseHandler';


class TrueHandler implements PacketHandler {

    handlePacket() {
        return true;
    }

}

class FalseHandler implements PacketHandler {

    handlePacket() {
        return false;
    }

}


class TestDelegator extends PacketDelegator {
    init(): void {
        this.handlers.set(0x01, new TrueHandler());
        this.handlers.set(0xff, new FalseHandler());
    }
    
}

describe('server/baseDelegator.ts', () => {

    const delegator = new TestDelegator();

    it('should delegate opcode 0x01 to true', () => {
        expect(delegator.getHandler(0x01).handlePacket(null, null)).to.equal(true);
    });

    it('should delegate opcode 0xff to false', () => {
        expect(delegator.getHandler(0xff).handlePacket(null, null)).to.equal(false);
    });
});