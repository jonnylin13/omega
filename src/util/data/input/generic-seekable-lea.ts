import { GenericLittleEndianAccessor } from './generic-lea';
import { SeekableLittleEndianAccessor } from './seekable-lea';

export class GenericSeekableLittleEndianAccessor extends GenericLittleEndianAccessor implements SeekableLittleEndianAccessor {
    buf: Buffer;

    constructor(buf: Buffer) {
        super(buf);
    }

    seek(offset: number): void {
        this.bytes_read = offset;
    }

    get_position(): number {
        return this.bytes_read;
    }

}