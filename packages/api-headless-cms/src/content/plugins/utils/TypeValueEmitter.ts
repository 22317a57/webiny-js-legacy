import EventEmitter from "events";

export class TypeValueEmitter extends EventEmitter {
    cache: { [key: string]: any };

    constructor() {
        super();
        this.cache = {};
    }

    get(key) {
        return new Promise(resolve => {
            if (this.cache[key]) {
                return resolve(this.cache[key]);
            }

            this.on(key, resolve);
        });
    }

    set(key, value) {
        this.cache[key] = value;
        this.emit(key, value);
    }
}
