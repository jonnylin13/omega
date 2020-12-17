

export class Time {

    // TODO: Needs validation
    private static FT_UT_OFFSET = BigInt(116444736010800000) + BigInt(10000 * new Date().getTimezoneOffset()); // normalize with timezone offset suggested by Ari
    private static DEFAULT_TIME = BigInt(150842304000000000);//00 80 05 BB 46 E6 17 02
    public static ZERO_TIME = BigInt(94354848000000000);//00 40 E0 FD 3B 37 4F 01
    private static PERMANENT = BigInt(50841440000000000); // 00 C0 9B 90 7D E5 17 02

    // TODO: Needs validation
    static get_time(utc_timestamp: BigInt): BigInt {

        if (utc_timestamp < BigInt(0) && utc_timestamp >= BigInt(-3)) {
            if (utc_timestamp === BigInt(-1)) {
                return this.DEFAULT_TIME;
            } else if (utc_timestamp === BigInt(-2)) {
                return this.ZERO_TIME;
            } else {
                return this.PERMANENT;
            }
        }
        return BigInt(utc_timestamp) * BigInt(10000) + this.FT_UT_OFFSET;
    }
}