export class PUID {
    private static _id = 0;
    private static _uids: Record<any, any> = {};
    static id(obj: Record<any, any>) {
        // cache uid
        for (const id in PUID._uids) {
            if (PUID._uids[id] === obj) return id;
        }
        // generate new uid
        const nid = "PUID_" + (PUID._id++);
        PUID._uids[nid] = obj;
        return nid;
    }

    static hash(str: string) {
        // TODO 待补充字符串的 hash 算法
        return str;
    }

    static clear() {
        // TODO 待完善
        PUID._id = 0;
        PUID._uids = {};
    }
}