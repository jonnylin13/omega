import * as crypto from 'crypto';
import { Convert } from '../../util/convert';
import { LittleEndianAccessor } from '../../util/data/input/interface/lea';


let iv: Int8Array = new Int8Array([
    0x4d,  0x23,  0xc7,  0x2b,
    0x4d,  0x23,  0xc7,  0x2b,
    0x4d,  0x23,  0xc7,  0x2b,
    0x4d,  0x23,  0xc7,  0x2b
]);
const key: Int8Array = new Int8Array([
    0x13, 0x00, 0x00, 0x00,
    0x08, 0x00, 0x00, 0x00,
    0x06, 0x00, 0x00, 0x00,
    0xB4, 0x00, 0x00, 0x00,
    0x1B, 0x00, 0x00, 0x00,
    0x0F, 0x00, 0x00, 0x00,
    0x33, 0x00, 0x00, 0x00,
    0x52, 0x00, 0x00, 0x00
]);

export class WZTool {

    static cipher = crypto.createCipheriv('aes-256-ofb', key, iv);
    static enc_key: Int8Array;

    static _init() {
        this.enc_key = new Int8Array([0xFFFF]);
        for (let i = 0; i < (0xFFFF / 16); i++) {
            iv = Int8Array.from(this.cipher.update(iv));
            // TODO: Verify this does the same as arraycopy()
            this.enc_key.set(iv, i * 16);
        }

        iv = Int8Array.from(this.cipher.update(iv));
        if (iv.length > 15) iv = iv.slice(0, -1);
        this.enc_key.set(iv, 65520);
    }

    static read_list_string(str: Int8Array): Int8Array {
        for (let i = 0; i < str.length; i++) {
            str[i] ^= (str[i] ^ this.enc_key[i]);
        }
        return str;
    }

    static read_decoded_string(llea: LittleEndianAccessor): string {

        let str_length;
        let b = llea.read_byte();
        if (b === 0x00) return '';

        if (b >= 0) {

            if (b === 0x7F) str_length = llea.read_int();
            else str_length = b;
            if (str_length < 0) return '';
            let str: Int8Array = new Int8Array([str_length * 2]);
            for (let i = 0; i < str.length * 2; i++)
                str[i] = llea.read_byte();
            return this.decrypt_unicode_string(str);

        } else {
            if (b == -128) str_length = llea.read_int();
            else str_length = -b;
            if (str_length < 0) return '';
            let str: Int8Array = new Int8Array([str_length]);
            for (let i = 0; i < str_length; i++) 
                str[i] = llea.read_byte();
            
            return this.decrypt_ascii_string(str);
        }
    }

    // TODO: Needs validation
    static decrypt_ascii_string(str: Int8Array): string {
        let xor_byte = 0xAA;
        for (let i = 0; i < str.length; i++) {
            str[i] = (str[i] ^ xor_byte ^ this.enc_key[i]);
            xor_byte++;
        }
        return Convert.buf_to_string(str);
    }

    // TODO: Needs validation
    static decrypt_unicode_string(str: Int8Array): string {
        let xor_byte = 0xAAAA;
        let char_ret: Int16Array = new Int16Array(str.length / 2);

        for (let i = 0; i < str.length; i++) 
            str[i] = (str[i] ^ this.enc_key[i]);
        
        for (let i = 0; i < (str.length / 2); i++) {
            let to_xor = ((str[i] << 8) | str[i + 1]);
            char_ret[i] = (to_xor ^ xor_byte);
            xor_byte++;
        }
        return Convert.buf_to_string(char_ret);
    }
    
}
WZTool._init();