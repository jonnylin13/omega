

export class MapleStat {

    static SKIN = new MapleStat(0x01);
    static FACE = new MapleStat(0x2);
    static HAIR = new MapleStat(0x4);
    static LEVEL = new MapleStat(0x10);
    static JOB = new MapleStat(0x20);
    static STR = new MapleStat(0x40);
    static DEX = new MapleStat(0x80);
    static INT = new MapleStat(0x100);
    static LUK = new MapleStat(0x200);
    static HP = new MapleStat(0x400);
    static MAX_HP = new MapleStat(0x800);
    static MP = new MapleStat(0x1000);
    static MAX_MP = new MapleStat(0x2000);
    static AVAILABLE_AP = new MapleStat(0x4000);
    static AVAILABLE_SP = new MapleStat(0x8000);
    static EXP = new MapleStat(0x10000);
    static FAME = new MapleStat(0x20000);
    static MESO = new MapleStat(0x40000);
    static PET = new MapleStat(0x180008);
    static GACHA_EXP = new MapleStat(0x200000);

    private i: number;

    constructor(i: number) {
        this.i = i;
    }

    get_value() {
        return this.i;
    }
}