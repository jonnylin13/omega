

export class SendOpcode {
    static LOGIN_STATUS = new SendOpcode(0x0);
    static GUEST_ID_LOGIN = new SendOpcode(0x1);
    static ACCOUNT_INFO = new SendOpcode(0x2);
    static SERVERSTATUS = new SendOpcode(0x3);
    static GENDER_DONE = new SendOpcode(0x4);
    static CONFIRM_EULA_RESULT = new SendOpcode(0x5);
    static CHECK_PINCODE = new SendOpcode(0x6);
    static UPDATE_PINCODE = new SendOpcode(0x7);
    static VIEW_ALL_CHAR = new SendOpcode(0x8);
    static SELECT_CHARACTER_BY_VAC = new SendOpcode(0x9);
    static SERVERLIST = new SendOpcode(0xA);
    static CHARLIST = new SendOpcode(0xB);
    static SERVER_IP = new SendOpcode(0xC);
    static CHAR_NAME_RESPONSE = new SendOpcode(0xD);
    static ADD_NEW_CHAR_ENTRY = new SendOpcode(0xE);
    static DELETE_CHAR_RESPONSE = new SendOpcode(0xF);
    static CHANGE_CHANNEL = new SendOpcode(0x10);
    static PING = new SendOpcode(0x11);
    static KOREAN_INTERNET_CAFE_SHIT = new SendOpcode(0x12);
    static CHANNEL_SELECTED = new SendOpcode(0x14);
    static HACKSHIELD_REQUEST = new SendOpcode(0x15);
    static RELOG_RESPONSE = new SendOpcode(0x16);
    static CHECK_CRC_RESULT = new SendOpcode(0x19);
    static LAST_CONNECTED_WORLD = new SendOpcode(0x1A);
    static RECOMMENDED_WORLD_MESSAGE = new SendOpcode(0x1B);
    static CHECK_SPW_RESULT = new SendOpcode(0x1C);
    static INVENTORY_OPERATION = new SendOpcode(0x1D);
    static INVENTORY_GROW = new SendOpcode(0x1E);
    static STAT_CHANGED = new SendOpcode(0x1F);
    static GIVE_BUFF = new SendOpcode(0x20);
    static CANCEL_BUFF = new SendOpcode(0x21);
    static FORCED_STAT_SET = new SendOpcode(0x22);
    static FORCED_STAT_RESET = new SendOpcode(0x23);
    static UPDATE_SKILLS = new SendOpcode(0x24);
    static SKILL_USE_RESULT = new SendOpcode(0x25);
    static FAME_RESPONSE = new SendOpcode(0x26);
    static SHOW_STATUS_INFO = new SendOpcode(0x27);
    static OPEN_FULL_CLIENT_DOWNLOAD_LINK = new SendOpcode(0x28);
    static MEMO_RESULT = new SendOpcode(0x29);
    static MAP_TRANSFER_RESULT = new SendOpcode(0x2A);
    static WEDDING_PHOTO = new SendOpcode(0x2B);
    static CLAIM_RESULT = new SendOpcode(0x2D);
    static CLAIM_AVAILABLE_TIME = new SendOpcode(0x2E);
    static CLAIM_STATUS_CHANGED = new SendOpcode(0x2F);
    static SET_TAMING_MOB_INFO = new SendOpcode(0x30);
    static QUEST_CLEAR = new SendOpcode(0x31);
    static ENTRUSTED_SHOP_CHECK_RESULT = new SendOpcode(0x32);
    static SKILL_LEARN_ITEM_RESULT = new SendOpcode(0x33);
    static GATHER_ITEM_RESULT = new SendOpcode(0x34);
    static SORT_ITEM_RESULT = new SendOpcode(0x35);
    static SUE_CHARACTER_RESULT = new SendOpcode(0x37);
    static TRADE_MONEY_LIMIT = new SendOpcode(0x39);
    static SET_GENDER = new SendOpcode(0x3A);
    static GUILD_BBS_PACKET = new SendOpcode(0x3B);
    static CHAR_INFO = new SendOpcode(0x3D);
    static PARTY_OPERATION = new SendOpcode(0x3E);
    static BUDDYLIST = new SendOpcode(0x3F);
    static GUILD_OPERATION = new SendOpcode(0x41);
    static ALLIANCE_OPERATION = new SendOpcode(0x42);
    static SPAWN_PORTAL = new SendOpcode(0x43);
    static SERVERMESSAGE = new SendOpcode(0x44);
    static INCUBATOR_RESULT = new SendOpcode(0x45);
    static SHOP_SCANNER_RESULT = new SendOpcode(0x46);
    static SHOP_LINK_RESULT = new SendOpcode(0x47);
    static MARRIAGE_REQUEST = new SendOpcode(0x48);
    static MARRIAGE_RESULT = new SendOpcode(0x49);
    static WEDDING_GIFT_RESULT = new SendOpcode(0x4A);
    static NOTIFY_MARRIED_PARTNER_MAP_TRANSFER = new SendOpcode(0x4B);
    static CASH_PET_FOOD_RESULT = new SendOpcode(0x4C);
    static SET_WEEK_EVENT_MESSAGE = new SendOpcode(0x4D);
    static SET_POTION_DISCOUNT_RATE = new SendOpcode(0x4E);
    static BRIDLE_MOB_CATCH_FAIL = new SendOpcode(0x4F);
    static IMITATED_NPC_RESULT = new SendOpcode(0x50);
    static IMITATED_NPC_DATA = new SendOpcode(0x51);
    static LIMITED_NPC_DISABLE_INFO = new SendOpcode(0x52);
    static MONSTER_BOOK_SET_CARD = new SendOpcode(0x53);
    static MONSTER_BOOK_SET_COVER = new SendOpcode(0x54);
    static HOUR_CHANGED = new SendOpcode(0x55);
    static MINIMAP_ON_OFF = new SendOpcode(0x56);
    static CONSULT_AUTHKEY_UPDATE = new SendOpcode(0x57);
    static CLASS_COMPETITION_AUTHKEY_UPDATE = new SendOpcode(0x58);
    static WEB_BOARD_AUTHKEY_UPDATE = new SendOpcode(0x59);
    static SESSION_VALUE = new SendOpcode(0x5A);
    static PARTY_VALUE = new SendOpcode(0x5B);
    static FIELD_SET_VARIABLE = new SendOpcode(0x5C);
    static BONUS_EXP_CHANGED = new SendOpcode(0x5D);
    static FAMILY_CHART_RESULT = new SendOpcode(0x5E);
    static FAMILY_INFO_RESULT = new SendOpcode(0x5F);
    static FAMILY_RESULT = new SendOpcode(0x60);
    static FAMILY_JOIN_REQUEST = new SendOpcode(0x61);
    static FAMILY_JOIN_REQUEST_RESULT = new SendOpcode(0x62);
    static FAMILY_JOIN_ACCEPTED = new SendOpcode(0x63);
    static FAMILY_PRIVILEGE_LIST = new SendOpcode(0x64);
    static FAMILY_REP_GAIN = new SendOpcode(0x65);
    static FAMILY_NOTIFY_LOGIN_OR_LOGOUT = new SendOpcode(0x66);
    static FAMILY_SET_PRIVILEGE = new SendOpcode(0x67);
    static FAMILY_SUMMON_REQUEST = new SendOpcode(0x68);
    static NOTIFY_LEVELUP = new SendOpcode(0x69);
    static NOTIFY_MARRIAGE = new SendOpcode(0x6A);
    static NOTIFY_JOB_CHANGE = new SendOpcode(0x6B);
    static MAPLE_TV_USE_RES = new SendOpcode(0x6D);
    static AVATAR_MEGAPHONE_RESULT = new SendOpcode(0x6E);
    static SET_AVATAR_MEGAPHONE = new SendOpcode(0x6F);
    static CLEAR_AVATAR_MEGAPHONE = new SendOpcode(0x70);
    static CANCEL_NAME_CHANGE_RESULT = new SendOpcode(0x71);
    static CANCEL_TRANSFER_WORLD_RESULT = new SendOpcode(0x72);
    static DESTROY_SHOP_RESULT = new SendOpcode(0x73);
    static FAKE_GM_NOTICE = new SendOpcode(0x74);
    static SUCCESS_IN_USE_GACHAPON_BOX = new SendOpcode(0x75);
    static NEW_YEAR_CARD_RES = new SendOpcode(0x76);
    static RANDOM_MORPH_RES = new SendOpcode(0x77);
    static CANCEL_NAME_CHANGE_BY_OTHER = new SendOpcode(0x78);
    static SET_EXTRA_PENDANT_SLOT = new SendOpcode(0x79);
    static SCRIPT_PROGRESS_MESSAGE = new SendOpcode(0x7A);
    static DATA_CRC_CHECK_FAILED = new SendOpcode(0x7B);
    static MACRO_SYS_DATA_INIT = new SendOpcode(0x7C);
    static SET_FIELD = new SendOpcode(0x7D);
    static SET_ITC = new SendOpcode(0x7E);
    static SET_CASH_SHOP = new SendOpcode(0x7F);
    static SET_BACK_EFFECT = new SendOpcode(0x80);
    static SET_MAP_OBJECT_VISIBLE = new SendOpcode(0x81);
    static CLEAR_BACK_EFFECT = new SendOpcode(0x82);
    static BLOCKED_MAP = new SendOpcode(0x83);
    static BLOCKED_SERVER = new SendOpcode(0x84);
    static FORCED_MAP_EQUIP = new SendOpcode(0x85);
    static MULTICHAT = new SendOpcode(0x86);
    static WHISPER = new SendOpcode(0x87);
    static SPOUSE_CHAT = new SendOpcode(0x88);
    static SUMMON_ITEM_INAVAILABLE = new SendOpcode(0x89);
    static FIELD_EFFECT = new SendOpcode(0x8A);
    static FIELD_OBSTACLE_ONOFF = new SendOpcode(0x8B);
    static FIELD_OBSTACLE_ONOFF_LIST = new SendOpcode(0x8C);
    static FIELD_OBSTACLE_ALL_RESET = new SendOpcode(0x8D);
    static BLOW_WEATHER = new SendOpcode(0x8E);
    static PLAY_JUKEBOX = new SendOpcode(0x8F);
    static ADMIN_RESULT = new SendOpcode(0x90);
    static OX_QUIZ = new SendOpcode(0x91);
    static GMEVENT_INSTRUCTIONS = new SendOpcode(0x92);
    static CLOCK = new SendOpcode(0x93);
    static CONTI_MOVE = new SendOpcode(0x94);
    static CONTI_STATE = new SendOpcode(0x95);
    static SET_QUEST_CLEAR = new SendOpcode(0x96);
    static SET_QUEST_TIME = new SendOpcode(0x97);
    static ARIANT_RESULT = new SendOpcode(0x98);
    static SET_OBJECT_STATE = new SendOpcode(0x99);
    static STOP_CLOCK = new SendOpcode(0x9A);
    static ARIANT_ARENA_SHOW_RESULT = new SendOpcode(0x9B);
    static PYRAMID_GAUGE = new SendOpcode(0x9D);
    static PYRAMID_SCORE = new SendOpcode(0x9E);
    static QUICKSLOT_INIT = new SendOpcode(0x9F);
    static SPAWN_PLAYER = new SendOpcode(0xA0);
    static REMOVE_PLAYER_FROM_MAP = new SendOpcode(0xA1);
    static CHATTEXT = new SendOpcode(0xA2);
    static CHATTEXT1 = new SendOpcode(0xA3);
    static CHALKBOARD = new SendOpcode(0xA4);
    static UPDATE_CHAR_BOX = new SendOpcode(0xA5);
    static SHOW_CONSUME_EFFECT = new SendOpcode(0xA6);
    static SHOW_SCROLL_EFFECT = new SendOpcode(0xA7);
    static SPAWN_PET = new SendOpcode(0xA8);
    static MOVE_PET = new SendOpcode(0xAA);
    static PET_CHAT = new SendOpcode(0xAB);
    static PET_NAMECHANGE = new SendOpcode(0xAC);
    static PET_EXCEPTION_LIST = new SendOpcode(0xAD);
    static PET_COMMAND = new SendOpcode(0xAE);
    static SPAWN_SPECIAL_MAPOBJECT = new SendOpcode(0xAF);
    static REMOVE_SPECIAL_MAPOBJECT = new SendOpcode(0xB0);
    static MOVE_SUMMON = new SendOpcode(0xB1);
    static SUMMON_ATTACK = new SendOpcode(0xB2);
    static DAMAGE_SUMMON = new SendOpcode(0xB3);
    static SUMMON_SKILL = new SendOpcode(0xB4);
    static SPAWN_DRAGON = new SendOpcode(0xB5);
    static MOVE_DRAGON = new SendOpcode(0xB6);
    static REMOVE_DRAGON = new SendOpcode(0xB7);
    static MOVE_PLAYER = new SendOpcode(0xB9);
    static CLOSE_RANGE_ATTACK = new SendOpcode(0xBA);
    static RANGED_ATTACK = new SendOpcode(0xBB);
    static MAGIC_ATTACK = new SendOpcode(0xBC);
    static ENERGY_ATTACK = new SendOpcode(0xBD);
    static SKILL_EFFECT = new SendOpcode(0xBE);
    static CANCEL_SKILL_EFFECT = new SendOpcode(0xBF);
    static DAMAGE_PLAYER = new SendOpcode(0xC0);
    static FACIAL_EXPRESSION = new SendOpcode(0xC1);
    static SHOW_ITEM_EFFECT = new SendOpcode(0xC2);
    static SHOW_CHAIR = new SendOpcode(0xC4);
    static UPDATE_CHAR_LOOK = new SendOpcode(0xC5);
    static SHOW_FOREIGN_EFFECT = new SendOpcode(0xC6);
    static GIVE_FOREIGN_BUFF = new SendOpcode(0xC7);
    static CANCEL_FOREIGN_BUFF = new SendOpcode(0xC8);
    static UPDATE_PARTYMEMBER_HP = new SendOpcode(0xC9);
    static GUILD_NAME_CHANGED = new SendOpcode(0xCA);
    static GUILD_MARK_CHANGED = new SendOpcode(0xCB);
    static THROW_GRENADE = new SendOpcode(0xCC);
    static CANCEL_CHAIR = new SendOpcode(0xCD);
    static SHOW_ITEM_GAIN_INCHAT = new SendOpcode(0xCE);
    static DOJO_WARP_UP = new SendOpcode(0xCF);
    static LUCKSACK_PASS = new SendOpcode(0xD0);
    static LUCKSACK_FAIL = new SendOpcode(0xD1);
    static MESO_BAG_MESSAGE = new SendOpcode(0xD2);
    static UPDATE_QUEST_INFO = new SendOpcode(0xD3);
    static PLAYER_HINT = new SendOpcode(0xD6);
    static MAKER_RESULT = new SendOpcode(0xD9);
    static KOREAN_EVENT = new SendOpcode(0xDB);
    static OPEN_UI = new SendOpcode(0xDC);
    static LOCK_UI = new SendOpcode(0xDD);
    static DISABLE_UI = new SendOpcode(0xDE);
    static SPAWN_GUIDE = new SendOpcode(0xDF);
    static TALK_GUIDE = new SendOpcode(0xE0);
    static SHOW_COMBO = new SendOpcode(0xE1);
    static COOLDOWN = new SendOpcode(0xEA);
    static SPAWN_MONSTER = new SendOpcode(0xEC);
    static KILL_MONSTER = new SendOpcode(0xED);
    static SPAWN_MONSTER_CONTROL = new SendOpcode(0xEE);
    static MOVE_MONSTER = new SendOpcode(0xEF);
    static MOVE_MONSTER_RESPONSE = new SendOpcode(0xF0);
    static APPLY_MONSTER_STATUS = new SendOpcode(0xF2);
    static CANCEL_MONSTER_STATUS = new SendOpcode(0xF3);
    static RESET_MONSTER_ANIMATION = new SendOpcode(0xF4);
    static DAMAGE_MONSTER = new SendOpcode(0xF6);
    static ARIANT_THING = new SendOpcode(0xF9);
    static SHOW_MONSTER_HP = new SendOpcode(0xFA);
    static CATCH_MONSTER = new SendOpcode(0xFB);
    static CATCH_MONSTER_WITH_ITEM = new SendOpcode(0xFC);
    static SHOW_MAGNET = new SendOpcode(0xFD);
    static SPAWN_NPC = new SendOpcode(0x101);
    static REMOVE_NPC = new SendOpcode(0x102);
    static SPAWN_NPC_REQUEST_CONTROLLER = new SendOpcode(0x103);
    static NPC_ACTION = new SendOpcode(0x104);
    static SET_NPC_SCRIPTABLE = new SendOpcode(0x107);
    static SPAWN_HIRED_MERCHANT = new SendOpcode(0x109);
    static DESTROY_HIRED_MERCHANT = new SendOpcode(0x10A);
    static UPDATE_HIRED_MERCHANT = new SendOpcode(0x10B);
    static DROP_ITEM_FROM_MAPOBJECT = new SendOpcode(0x10C);
    static REMOVE_ITEM_FROM_MAP = new SendOpcode(0x10D);
    static CANNOT_SPAWN_KITE = new SendOpcode(0x10E);
    static SPAWN_KITE = new SendOpcode(0x10F);
    static REMOVE_KITE = new SendOpcode(0x110);
    static SPAWN_MIST = new SendOpcode(0x111);
    static REMOVE_MIST = new SendOpcode(0x112);
    static SPAWN_DOOR = new SendOpcode(0x113);
    static REMOVE_DOOR = new SendOpcode(0x114);
    static REACTOR_HIT = new SendOpcode(0x115);
    static REACTOR_SPAWN = new SendOpcode(0x117);
    static REACTOR_DESTROY = new SendOpcode(0x118);
    static SNOWBALL_STATE = new SendOpcode(0x119);
    static HIT_SNOWBALL = new SendOpcode(0x11A);
    static SNOWBALL_MESSAGE = new SendOpcode(0x11B);
    static LEFT_KNOCK_BACK = new SendOpcode(0x11C);
    static COCONUT_HIT = new SendOpcode(0x11D);
    static COCONUT_SCORE = new SendOpcode(0x11E);
    static GUILD_BOSS_HEALER_MOVE = new SendOpcode(0x11F);
    static GUILD_BOSS_PULLEY_STATE_CHANGE = new SendOpcode(0x120);
    static MONSTER_CARNIVAL_START = new SendOpcode(0x121);
    static MONSTER_CARNIVAL_OBTAINED_CP = new SendOpcode(0x122);
    static MONSTER_CARNIVAL_PARTY_CP = new SendOpcode(0x123);
    static MONSTER_CARNIVAL_SUMMON = new SendOpcode(0x124);
    static MONSTER_CARNIVAL_MESSAGE = new SendOpcode(0x125);
    static MONSTER_CARNIVAL_DIED = new SendOpcode(0x126);
    static MONSTER_CARNIVAL_LEAVE = new SendOpcode(0x127);
    static ARIANT_ARENA_USER_SCORE = new SendOpcode(0x129);
    static SHEEP_RANCH_INFO = new SendOpcode(0x12B);
    static SHEEP_RANCH_CLOTHES = new SendOpcode(0x12C);
    static WITCH_TOWER_SCORE_UPDATE = new SendOpcode(0x12D);
    static HORNTAIL_CAVE = new SendOpcode(0x12E);
    static ZAKUM_SHRINE = new SendOpcode(0x12F);
    static NPC_TALK = new SendOpcode(0x130);
    static OPEN_NPC_SHOP = new SendOpcode(0x131);
    static CONFIRM_SHOP_TRANSACTION = new SendOpcode(0x132);
    static ADMIN_SHOP_MESSAGE = new SendOpcode(0x133);
    static ADMIN_SHOP = new SendOpcode(0x134);
    static STORAGE = new SendOpcode(0x135);
    static FREDRICK_MESSAGE = new SendOpcode(0x136);
    static FREDRICK = new SendOpcode(0x137);
    static RPS_GAME = new SendOpcode(0x138);
    static MESSENGER = new SendOpcode(0x139);
    static PLAYER_INTERACTION = new SendOpcode(0x13A);
    static TOURNAMENT = new SendOpcode(0x13B);
    static TOURNAMENT_MATCH_TABLE = new SendOpcode(0x13C);
    static TOURNAMENT_SET_PRIZE = new SendOpcode(0x13D);
    static TOURNAMENT_UEW = new SendOpcode(0x13E);
    static TOURNAMENT_CHARACTERS = new SendOpcode(0x13F);
    static WEDDING_PROGRESS = new SendOpcode(0x140);
    static WEDDING_CEREMONY_END = new SendOpcode(0x141);
    static PARCEL = new SendOpcode(0x142);
    static CHARGE_PARAM_RESULT = new SendOpcode(0x143);
    static QUERY_CASH_RESULT = new SendOpcode(0x144);
    static CASHSHOP_OPERATION = new SendOpcode(0x145);
    static CASHSHOP_PURCHASE_EXP_CHANGED = new SendOpcode(0x146);
    static CASHSHOP_GIFT_INFO_RESULT = new SendOpcode(0x147);
    static CASHSHOP_CHECK_NAME_CHANGE = new SendOpcode(0x148);
    static CASHSHOP_CHECK_NAME_CHANGE_POSSIBLE_RESULT = new SendOpcode(0x149);
    static CASHSHOP_REGISTER_NEW_CHARACTER_RESULT = new SendOpcode(0x14A);
    static CASHSHOP_CHECK_TRANSFER_WORLD_POSSIBLE_RESULT = new SendOpcode(0x14B);
    static CASHSHOP_GACHAPON_STAMP_RESULT = new SendOpcode(0x14C);
    static CASHSHOP_CASH_ITEM_GACHAPON_RESULT = new SendOpcode(0x14D);
    static CASHSHOP_CASH_GACHAPON_OPEN_RESULT = new SendOpcode(0x14E);
    static KEYMAP = new SendOpcode(0x14F);
    static AUTO_HP_POT = new SendOpcode(0x150);
    static AUTO_MP_POT = new SendOpcode(0x151);
    static SEND_TV = new SendOpcode(0x155);
    static REMOVE_TV = new SendOpcode(0x156);
    static ENABLE_TV = new SendOpcode(0x157);
    static MTS_OPERATION2 = new SendOpcode(0x15B);
    static MTS_OPERATION = new SendOpcode(0x15C);
    static MAPLELIFE_RESULT = new SendOpcode(0x15D);
    static MAPLELIFE_ERROR = new SendOpcode(0x15E);
    static VICIOUS_HAMMER = new SendOpcode(0x162);
    static VEGA_SCROLL = new SendOpcode(0x166);
    
    code = -2;

    constructor(code: number) {
        this.code = code;
    }

    get_value(): number {
        return this.code;
    }
}