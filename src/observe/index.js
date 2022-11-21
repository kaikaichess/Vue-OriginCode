import { newArrayProto } from "./array";

class Observer {
    constructor(data) {
        Object.defineProperty(data, '__ob__', {
            value: this,  // 这里的this是Observer实例，同时这里相当于给数据加了一个标识，如果数据上有__ob__就说明这个数据被观测过了
            enumerable: false  // 设置该属性不可遍历，防止递归死循环爆栈
        })
        if (Array.isArray(data)) {
            data.__proto__ = newArrayProto;
            this.observeArray(data);
        } else {
            this.walk(data);
        }
    }
    walk(data) {
        // walk循环对象属性并依次劫持
        Object.keys(data).forEach((key) =>
            defineReactive(data, key, data[key])
        );
    }
    observeArray(data) {
        data.forEach((item) => observe(item)); // 如果数组中的元素为对象，则其也会被观测
    }
}

export function defineReactive(target, key, value) {
    observe(value);
    Object.defineProperty(target, key, {
        get() {
            return value;
        },
        set(newValue) {
            if (newValue === value) return;
            value = newValue;
        },
    });
}

export function observe(data) {
    if (typeof data !== "object" || data === null) {
        return;
    }

    if(data.__ob__ instanceof Observer) {  // 说明已经被观测过了
        return
    }

    return new Observer(data);
}
