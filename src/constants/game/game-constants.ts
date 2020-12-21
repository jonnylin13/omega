import { MapleJob } from "../../client/character/job";



export class GameConstants {
    static WORLD_NAMES: Array<string> = ["Scania", "Bera", "Broa", "Windia", "Khaini", "Bellocan", "Mardia", "Kradia", "Yellonde", "Demethos", "Galicia", "El Nido", "Zenith", "Arcenia", "Kastia", "Judis", "Plana", "Kalluna", "Stius", "Croa", "Medere"];

    static has_sp_table(job: MapleJob): boolean {
        return true; // TODO: Needs implementation
    }

    static get_skill_book(job: number) {
        if (job >= 2210 && job <= 2218) return job - 2209;
        return 0;
    }
}