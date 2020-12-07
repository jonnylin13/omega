import { Convert } from '../util/convert';

export class MapleCustomEncryption {

    static roll_left(input_byte: number, bit_length: number) {
        let temp = input_byte & 0xFF;
        temp = temp << (bit_length % 8);
        return Convert.sign_byte((temp & 0xFF) | (temp >> 8));
    }

    static roll_right(input_byte: number, bit_length: number) {
        let temp = input_byte & 0xFF;
        temp = (temp << 8) >>> (bit_length % 8);
        return Convert.sign_byte((temp & 0xFF) | (temp >>> 8));
    }

    static encrypt(data: Int8Array) {
        for (let i = 0; i < 6; i++) {
            let remember = 0;
            let length = (data.length & 0xFF);
            if (i % 2 === 0) {
                for (let j = 0; j < data.length; j++) {
                    let cur = data[j];
                    cur = MapleCustomEncryption.roll_left(cur, 3);
                    cur += length;
                    cur ^= remember;
                    remember = cur;
                    cur = MapleCustomEncryption.roll_right(cur, length & 0xFF);
                    cur = ((~cur) & 0xFF);
                    cur += 0x48;
                    length--;
                    data[j] = cur;
                }
            } else {
                for (let j = data.length - 1; j >= 0; j--) {
                    let cur = data[j];
                    cur = MapleCustomEncryption.roll_left(cur, 4);
                    cur += length;
                    cur ^= remember;
                    remember = cur;
                    cur ^= 0x13;
                    cur = MapleCustomEncryption.roll_right(cur, 3);
                    length--;
                    data[j] = cur;
                }
            }
        }
        return data;
    }

    static decrypt(data: Int8Array) {
        for (let i = 1; i <= 6; i++) {
            let remember = 0;
            let length = (data.length & 0xFF);
            let next_remember: number;
            if (i % 2 == 0) {

            }
        }
    }
}