export class Convert {

    // Implementation of 2s complement
    static sign(value: number, bit_length: number) {
        let is_negative = value & (1 << (bit_length - 1));
        let boundary = (1 << bit_length);
        let min_val = -boundary;
        let mask = boundary - 1;
        return is_negative ? min_val + (value & mask) : value;
    }

    static sign_byte(value: number) {
        return Convert.sign(value, 8);
    }

    static sign_array(arr: Array<number>, bit_length: number) {
        return arr.map((val) => Convert.sign(val, bit_length));
    }

    static buf_to_string(buf: ArrayBuffer) {
        return String.fromCharCode.apply(null, buf);
    }

    static int8_to_hexstr(arr: Int8Array) {
        return arr.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    }
}