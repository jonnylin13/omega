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
        return arr.map((val) => {
            return Convert.sign(val, bit_length);
        });
    }

    static compare_int8_array(arr1: Int8Array, arr2: Int8Array) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
}