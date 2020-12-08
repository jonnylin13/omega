import { LittleEndianAccessor } from './lea';


export interface SeekableLittleEndianAccessor extends LittleEndianAccessor {
    pos: number;
    seek(offset: number): void;
}