

export class MapleJob {

    static BEGINNER = new MapleJob(0);

    static WARRIOR = new MapleJob(100);
    static FIGHTER = new MapleJob(110);
    static CRUSADE = new MapleJob(111);
    static HERO = new MapleJob(112);
    static PAGE = new MapleJob(120);
    static WHITE_KNIGHT = new MapleJob(121);
    static PALADIN = new MapleJob(122);
    static SPEARMAN = new MapleJob(130);
    static DRAGON_KNIGHT = new MapleJob(131);
    static DARK_KNIGHT = new MapleJob(132);

    static MAGICIAN = new MapleJob(200);
    static FP_WIZARD = new MapleJob(210);
    static FP_MAGE = new MapleJob(211);
    static FP_ARCHMAGE = new MapleJob(212);
    static IL_WIZARD = new MapleJob(220);
    static IL_MAGE = new MapleJob(221);
    static IL_ARCHMAGE = new MapleJob(222);
    static CLERIC = new MapleJob(230);
    static PRIEST = new MapleJob(231);
    static BISHOP = new MapleJob(232);

    static BOWMAN = new MapleJob(300);
    static HUNTER = new MapleJob(310);
    static RANGER = new MapleJob(311);
    static BOWMASTER = new MapleJob(312);
    static CROSSBOWMAN = new MapleJob(320);
    static SNIPER = new MapleJob(321);
    static MARKSMAN = new MapleJob(322);

    static THIEF = new MapleJob(400);
    static ASSASSIN = new MapleJob(410);
    static HERMIT = new MapleJob(411);
    static NIGHT_LORD = new MapleJob(412);
    static BANDIT = new MapleJob(420);
    static CHIEF_BANDIT = new MapleJob(421);
    static SHADOWER = new MapleJob(422);

    static PIRATE = new MapleJob(500);
    static BRAWLER = new MapleJob(510);
    static MARAUDER = new MapleJob(511);
    static BUCCANEER = new MapleJob(512);
    static GUNSLINGER = new MapleJob(520);
    static OUTLAW = new MapleJob(521);
    static CORSAIR = new MapleJob(522);

    static MAPLE_LEAF_BRIGADIER = new MapleJob(800);
    static GM = new MapleJob(900);
    static SUPER_GM = new MapleJob(910);

    static NOBLESSE = new MapleJob(1000);
    static DAWN_WARRIOR_1 = new MapleJob(1100);
    static DAWN_WARRIOR_2 = new MapleJob(1110);
    static DAWN_WARRIOR_3 = new MapleJob(1111);
    static DAWN_WARRIOR_4 = new MapleJob(1112);
    static BLAZE_WIZARD_1 = new MapleJob(1200);
    static BLAZE_WIZARD_2 = new MapleJob(1210);
    static BLAZE_WIZARD_3 = new MapleJob(1211);
    static BLAZE_WIZARD_4 = new MapleJob(1212);
    static WIND_ARCHER_1 = new MapleJob(1300);
    static WIND_ARCHER_2 = new MapleJob(1310);
    static WIND_ARCHER_3 = new MapleJob(1311);
    static WIND_ARCHER_4 = new MapleJob(1312);
    static NIGHT_WALKER_1 = new MapleJob(1400);
    static NIGHT_WALKER_2 = new MapleJob(1410);
    static NIGHT_WALKER_3 = new MapleJob(1411);
    static NIGHT_WALKER_4 = new MapleJob(1412);
    static THUNDER_BREAKER_1 = new MapleJob(1500);
    static THUNDER_BREAKER_2 = new MapleJob(1510);
    static THUNDER_BREAKER_3 = new MapleJob(1511);
    static THUNDER_BREAKER_4 = new MapleJob(1512);

    static LEGEND = new MapleJob(2000);
    static EVAN = new MapleJob(2001);
    static ARAN_1 = new MapleJob(2100);
    static ARAN_2 = new MapleJob(2110);
    static ARAN_3 = new MapleJob(2111);
    static ARAN_4 = new MapleJob(2112);
    static EVAN_1 = new MapleJob(2200);
    static EVAN_2 = new MapleJob(2210);
    static EVAN_3 = new MapleJob(2211);
    static EVAN_4 = new MapleJob(2212);
    static EVAN_5 = new MapleJob(2213);
    static EVAN_6 = new MapleJob(2214);
    static EVAN_7 = new MapleJob(2215);
    static EVAN_8 = new MapleJob(2216);
    static EVAN_9 = new MapleJob(2217);
    static EVAN_10 = new MapleJob(2218);

    id: number;

    constructor(id: number) {
        this.id = id;
    }

    static values() {
        return Object.values(MapleJob);
    }

    get_id(): number {
        return this.id;
    }
}