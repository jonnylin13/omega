import { ModeOfOperation } from 'aes-js';

const skey: Uint8Array = new Uint8Array([0x13, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 
    0x06, 0x00, 0x00, 0x00, 0xB4, 0x00, 0x00, 0x00, 
    0x1B, 0x00, 0x00, 0x00, 0x0F, 0x00, 0x00, 0x00, 
    0x33, 0x00, 0x00, 0x00, 0x52, 0x00, 0x00, 0x00]);
const funny_bytes: Uint8Array = new Uint8Array([
    0xEC,  0x3F,  0x77,  0xA4,  0x45,  0xD0,  0x71,  0xBF,  0xB7,  0x98,  0x20,  0xFC,
    0x4B,  0xE9,  0xB3,  0xE1,  0x5C,  0x22,  0xF7,  0x0C,  0x44,  0x1B,  0x81,  0xBD,  0x63,  0x8D,  0xD4,  0xC3,
    0xF2,  0x10,  0x19,  0xE0,  0xFB,  0xA1,  0x6E,  0x66,  0xEA,  0xAE,  0xD6,  0xCE,  0x06,  0x18,  0x4E,  0xEB,
    0x78,  0x95,  0xDB,  0xBA,  0xB6,  0x42,  0x7A,  0x2A,  0x83,  0x0B,  0x54,  0x67,  0x6D,  0xE8,  0x65,  0xE7,
    0x2F,  0x07,  0xF3,  0xAA,  0x27,  0x7B,  0x85,  0xB0,  0x26,  0xFD,  0x8B,  0xA9,  0xFA,  0xBE,  0xA8,  0xD7,
    0xCB,  0xCC,  0x92,  0xDA,  0xF9,  0x93,  0x60,  0x2D,  0xDD,  0xD2,  0xA2,  0x9B,  0x39,  0x5F,  0x82,  0x21,
    0x4C,  0x69,  0xF8,  0x31,  0x87,  0xEE,  0x8E,  0xAD,  0x8C,  0x6A,  0xBC,  0xB5,  0x6B,  0x59,  0x13,  0xF1,
    0x04,  0x00,  0xF6,  0x5A,  0x35,  0x79,  0x48,  0x8F,  0x15,  0xCD,  0x97,  0x57,  0x12,  0x3E,  0x37,  0xFF,
    0x9D,  0x4F,  0x51,  0xF5,  0xA3,  0x70,  0xBB,  0x14,  0x75,  0xC2,  0xB8,  0x72,  0xC0,  0xED,  0x7D,  0x68,
    0xC9,  0x2E,  0x0D,  0x62,  0x46,  0x17,  0x11,  0x4D,  0x6C,  0xC4,  0x7E,  0x53,  0xC1,  0x25,  0xC7,  0x9A,
    0x1C,  0x88,  0x58,  0x2C,  0x89,  0xDC,  0x02,  0x64,  0x40,  0x01,  0x5D,  0x38,  0xA5,  0xE2,  0xAF,  0x55,
    0xD5,  0xEF,  0x1A,  0x7C,  0xA7,  0x5B,  0xA6,  0x6F,  0x86,  0x9F,  0x73,  0xE6,  0x0A,  0xDE,  0x2B,  0x99,
    0x4A,  0x47,  0x9C,  0xDF,  0x09,  0x76,  0x9E,  0x30,  0x0E,  0xE4,  0xB2,  0x94,  0xA0,  0x3B,  0x34,  0x1D,
    0x28,  0x0F,  0x36,  0xE3,  0x23,  0xB4,  0x03,  0xD8,  0x90,  0xC8,  0x3C,  0xFE,  0x5E,  0x32,  0x24,  0x50,
    0x1F,  0x3A,  0x43,  0x8A,  0x96,  0x41,  0x74,  0xAC,  0x52,  0x33,  0xF0,  0xD9,  0x29,  0x80,  0xB1,  0x16,
    0xD3,  0xAB,  0x91,  0xB9,  0x84,  0x7F,  0x61,  0x1E,  0xCF,  0xC5,  0xD1,  0x56,  0x3D,  0xCA,  0xF4,  0x05,
    0xC6,  0xE5,  0x08,  0x49
]);

export class MapleAESOFB {

    maple_version: number;
    iv: Uint8Array;
    cipher: ModeOfOperation.ModeOfOperationOFB;

    constructor(iv: Uint8Array, maple_version: number) {
        this.iv = iv;
        this.maple_version = ((maple_version >> 8) & 0xFF) | ((maple_version << 8) & 0xFF00);
        this.cipher = new ModeOfOperation.ModeOfOperationOFB(skey, iv);
    }

    static multiply_bytes(bytes: Uint8Array, count: number, multiply: number): Uint8Array {
        let ret = [];
        for (let x = 0; x < count * multiply; x++) {
            ret[x] = bytes[x % count];
        }
        return new Uint8Array(ret);
    }

    encrypt(data: Uint8Array) {
        let remaining = data.length;
        let chunk_length = 0x5B0;
        let start = 0;
        while (remaining > 0) {
            let my_iv = MapleAESOFB.multiply_bytes(this.iv, 4, 4);
            if (remaining < chunk_length) {
                chunk_length = remaining;
            }
            for (let x = start; x < (start + chunk_length); x++) {
                if ((x - start) % my_iv.length === 0) {
                    // let new_iv = this.cipher.encrypt(my_iv);
                    // for (let j = 0; j < my_iv.length; j++) {
                    //     my_iv[j] = new_iv[j];
                    // }
                    my_iv = this.cipher.encrypt(my_iv);
                }
                data[x] ^= my_iv[(x - start) % my_iv.length];
            }
            start += chunk_length;
            remaining -= chunk_length;
            chunk_length = 0x5B4;
        }
        this.update_iv();
        return data;
    }

    update_iv() {
        this.iv = MapleAESOFB.get_new_iv(this.iv);
    }

    // TODO: Check packet functions and see if they are signed or unsigned bytes
    get_packet_header(length: number): Uint8Array {
        let iiv = (this.iv[3]) & 0xFF;
        iiv |= (this.iv[2] << 8) & 0xFF00;
        iiv ^= this.maple_version;
        let m_length = ((length << 8) & 0xFF00) | (length >>> 8);
        let xored_iv = iiv ^ m_length;
        let ret = new Uint8Array();
        ret[0] = ((iiv >>> 8) & 0x0F);
        ret[1] = (iiv & 0xFF);
        ret[2] = ((xored_iv >>> 8) & 0xFF);
        ret[3] = (xored_iv & 0xFF);
        return ret;
    }

    static get_packet_length(packet_header: number): number {
        let packet_length = ((packet_header >>> 16) ^ (packet_header & 0xFFFF));
        packet_length = ((packet_length << 8) & 0xFF00) | ((packet_length >>> 8) & 0xFF);
        return packet_length;
    }

    check_packet(packet: Uint8Array): boolean {
        return ((((packet[0] ^ this.iv[2]) & 0xFF) == ((this.maple_version >> 8) & 0xFF)) && (((packet[1] ^ this.iv[3]) & 0xFF) == (this.maple_version & 0xFF)));
    }

    check_packet_by_header(packet_header: number): boolean {
        let packet = new Uint8Array();
        packet[0] = (packet_header >> 24) & 0xFF;
        packet[1] = (packet_header >> 16) & 0xFF;
        return this.check_packet(packet);
    }

    static get_new_iv(iv: Uint8Array): Uint8Array {
        let wtf: Uint8Array = new Uint8Array([0xf2, 0x53, 0x50, 0xc6]);
        for (let x = 0; x < 4; x++) {
            MapleAESOFB.funny_shit(iv[x], wtf);
        }
        return wtf;
    }

    // Someone pls explain this
    static funny_shit(input_byte: number, wtf: Uint8Array) {
        let elina = wtf[1];
        let anna = input_byte;
        let moritz = funny_bytes[elina & 0xFF];
        moritz -= input_byte;
        wtf[0] += moritz;
        moritz = wtf[2];
        moritz ^= funny_bytes[anna & 0xFF];
        elina -= moritz && 0xFF;
        wtf[1] = elina;
        elina = wtf[3];
        moritz = elina;
        elina -= wtf[0] & 0xFF;
        moritz = funny_bytes[moritz & 0xFF];
        moritz += input_byte;
        moritz ^= wtf[2];
        wtf[2] = moritz;
        elina += funny_bytes[anna & 0xFF] & 0xFF;
        wtf[3] = elina;
        let merry = (wtf[0]) & 0xFF;
        merry |= (wtf[1] << 8) & 0xFF00;
        merry |= (wtf[2] << 16) & 0xFF0000;
        merry |= (wtf[3] << 24) & 0xFF000000;
        let ret_value = merry;
        ret_value = ret_value >>> 0x1d;
        merry = merry << 3;
        ret_value = ret_value | merry;
        wtf[0] = (ret_value & 0xFF);
        wtf[1] = ((ret_value >> 8) & 0xFF);
        wtf[2] = ((ret_value >> 16) & 0xFF);
        wtf[3] = ((ret_value >> 24) & 0xFF);
        return wtf;
    }



}