import {isObject} from "../utils";
import {arrayMethods} from "./array";

class Observe {
    constructor(data) {  // 对对象中的所有属性进行劫持
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false // 不可枚举的
        })
        // data.__ob__ = this; // 给每一个监控过的对象都增加一个__ob__属性, this指的就是当前的实例 这样会导致死循环
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods;
            this.observeArray(data); // 对数组中的对象进行监控
        } else {
            this.walk(data);
        }
    }
    observeArray(data) {
        data.forEach(item => {
            observe(item);
        })
    }
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]);
        })
    }
}

function defineReactive(data, key, value) {  // value可能是对象，需要递归处理
    observe(value)
    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newValue) {  // 如果用户将值改为对象，继续监控
            observe(newValue);
            value = newValue;
        }
    })
}


export function observe(data) {
    if (!isObject(data)) {
        return;
    }
    // 如果已经被监控过了，就不要再监控了
    if (data.__ob__) {
        return data;
    }
    return new Observe(data);
}