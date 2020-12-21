import { createBuilderStatusReporter } from "typescript";
import { Config } from "../../../util/config";
import { Channel } from "../channel/channel";
import { PlayerStorage } from "../player-storage";

export class World {
    id: number;
    flag: number;
    exp_rate: number;
    drop_rate: number;
    boss_drop_rate: number;
    meso_rate: number;
    quest_rate: number;
    travel_rate: number;
    fishing_rate: number;
    event_msg: string;
    private channels: Array<Channel> = [];
    player_storage: PlayerStorage = new PlayerStorage();


    constructor(world: number, flag: number, event_msg: string, exp_rate: number, drop_rate: number, boss_drop_rate: number, meso_rate: number, quest_rate: number, travel_rate: number, fishing_rate: number) {
        this.id = world;
        this.flag = flag;
        this.event_msg = event_msg;
        this.exp_rate = exp_rate;
        this.drop_rate = drop_rate;
        this.boss_drop_rate = boss_drop_rate;
        this.meso_rate = meso_rate;
        this.quest_rate = quest_rate;
        this.travel_rate = travel_rate;
        this.fishing_rate = fishing_rate;
    }

    get_channels(): Array<Channel> {
        return this.channels;
    }

    get_channel(channel: number): Channel {
        return this.channels[channel - 1];
    }

    add_channel(channel: Channel): boolean {
        if (channel.id === this.channels.length + 1) {
            this.channels.push(channel);
            return true;
        }
        return false;
    }

    remove_channel(): number {
        let ch: Channel;
        let ch_idx: number = this.channels.length - 1;
        if (ch_idx < 0) return -1;
        ch = this.get_channel(ch_idx);
        if (ch === null || !ch.can_uninstall()) return -1;
        if (ch_idx === this.channels.length - 1) this.channels.pop();
        ch.shutdown();
        return ch.id;
    }

    is_capacity_full(): boolean {
        return this.get_capacity_status() === 2;
    }

    get_capacity_status(): number {
        let world_cap = this.channels.length * Config.properties.server.channel_load;
        let num_players = this.player_storage.size();
        let status;
        if (num_players >= world_cap) status = 2;
        else if (num_players >= world_cap * 0.8) status = 1;
        else status = 0;
        return status;
    }
}