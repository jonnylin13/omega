import { ByteInputStream } from './bs';


export interface SeekableInputByteStream extends ByteInputStream {
    pos: number;
    seek(offset: number): void;
}