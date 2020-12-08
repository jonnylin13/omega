import { Point } from '../../point';
import { LittleEndianAccessor } from './interface/lea';
import { ByteInputStream } from './interface/bs';


export class GenericLittleEndianAccessor implements LittleEndianAccessor {
    is: ByteInputStream;

    constructor(is: ByteInputStream) {
        this.is = is;
    }

    read_byte(): number {
        return this.is.read_byte();
    }

    read_short(): number {
        return this.is.read_short();
    }

    read_char(): string {
        return String.fromCharCode(97 + this.read_short());
    }

    read_int(): number {
        return this.is.read_int();
    }

    read_float(): number {
        return this.is.read_float();
    }

    read_long(): BigInt {
        return this.is.read_long();
    }

    read_double(): number {
        return this.is.read_double();
    }

    read_ascii_string(length: number): string {
        let ret: Array<string> = [];
        for (let i = 0; i < length; i++) {
            ret.push(String.fromCharCode(97 + this.read_byte()));
        }
        return ret.join('');
    }

    read_terminated_ascii_string(): string {
        let ret: Array<string> = [];
        while (true) {
            let byte = this.read_byte();
            if (byte === 0) break;
            ret.push(String.fromCharCode(97 + byte));
        }
        return ret.join('');
    }

    read_maple_ascii_string(): string {
        return this.read_ascii_string(this.read_short());
    }

    read(length: number): Int8Array {
        return this.is.read(length);
    }

    read_pos(): Point {
        let x = this.read_short();
        let y = this.read_short();
        return new Point(x, y);
    }

    skip(length: number): void {
        this.is.skip(length);
    }

}