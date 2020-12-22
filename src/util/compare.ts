export class Compare {

    static compare_int8_array(arr1: Int8Array, arr2: Int8Array) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    static compare_uint8_array(arr1: Uint8Array, arr2: Uint8Array) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    static compare_buffers(buf1: Buffer, buf2: Buffer) {
        if (buf1.length !== buf2.length) return false;
        for (let i = 0; i < buf1.length; i++) {
            if (buf1[i] !== buf2[i]) return false;
        }
        return true;
    }
}