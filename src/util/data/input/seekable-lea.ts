import { LittleEndianAccessor } from './lea';


export interface SeekableLittleEndianAccessor extends LittleEndianAccessor {
    seek(offset: number): void;
    get_position(): number;
}