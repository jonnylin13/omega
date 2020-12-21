import { GenericSeekableLittleEndianAccessor } from "../../util/data/input/generic-seekable-lea";
import { SeekableLittleEndianAccessor } from "../../util/data/input/interface/seekable-lea";
import { MaplePacketLittleEndianWriter } from "../../util/data/output/maple-lew";
import { AbstractMapleMapObject } from "./abstract-map-object";
import { AnimatedMapleMapObject } from "./interface/anim-map-object";


export abstract class AbstractAnimatedMapleMapObject extends AbstractMapleMapObject implements AnimatedMapleMapObject {

    stance: number;
    private static idle_movement_packet_data: Buffer;

    static init() {
        const mplew = new MaplePacketLittleEndianWriter(15);
        mplew.write_byte(1);
        mplew.write_byte(0);
        mplew.write_short(-1); // x
        mplew.write_short(-1); // y 
        mplew.write_short(0); // xwobble
    	mplew.write_short(0); // ywobble
    	mplew.write_short(0); // fh
    	mplew.write_byte(-1); // stance
    	mplew.write_short(0); // duration
    	this.idle_movement_packet_data = mplew.get_packet();
    }

    is_facing_left(): boolean {
        return Math.abs(this.stance) % 2 == 1;
    }

    get_idle_movement(): SeekableLittleEndianAccessor {
        let movement_data = Buffer.from(AbstractAnimatedMapleMapObject.idle_movement_packet_data);
        let x = this.position.x;
        let y = this.position.y;

        movement_data[2] = x & 0xFF;
        movement_data[3] = (x >> 8 & 0xFF);
        movement_data[4] = (y & 0xFF);
        movement_data[5] = (y >> 8 & 0xFF);
        movement_data[12] = this.stance & 0xFF;
        return new GenericSeekableLittleEndianAccessor(movement_data);
    }
}
AbstractAnimatedMapleMapObject.init();