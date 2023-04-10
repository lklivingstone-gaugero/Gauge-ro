import { v1 as uuid } from "uuid";

class utils {
    getUuid() {
        return uuid();
    }
}

export default new utils();
