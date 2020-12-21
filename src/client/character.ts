import { MapleClient } from "./client";


export class MapleCharacter {
    name: string;
    id: number;
    account_id: number;
    client: MapleClient;
    logged_in: boolean;
}