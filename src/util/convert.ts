


export module Convert {

    abstract class convert {

        data: any;

        constructor(data: any) {
            this.data = data
        }

        get(): any {
            return this.data;
        }

    }

    export class buffer extends convert {

        constructor(data: Buffer) {
            super(data);
        }
    
        toString(): string {
            return String.fromCharCode.apply(this.data);
        }

        toHexString(): string {
            return this.data.reduce((str: string, byte: number) =>  str + byte.toString(16).padStart(2, '0'), '');
        }
    
        toInt8Array(): Int8Array {
            return new Int8Array(this.data);
        }

        toUint8Array(): Uint8Array {
            return new Uint8Array(this.data);
        }

    }

    export class ipAddress extends convert {

        constructor(data: string) {
            super(data);
        }

        toBuffer(separator='.'): Buffer {
            let ipArray = this.data.split(separator);
            return Buffer.from(ipArray.map((dec: string) => parseInt(dec)));
        }
    }
}