import { isFunction } from "./utils";
import { observe } from "./observe/index";

export function initState(vm) {  // 状态的初始化
    // console.log(vm.$options);
    const opts = vm.$options;
    // if (opts.props) {
    //     initProps(vm);
    // }
    // if (opts.methods) {
    //     initMethods(vm);
    // }
    if (opts.data) {
        initData(vm);
    }
    // if (opts.computed) {
    //     initComputed(vm);
    // }
    // if (opts.watch) {
    //     initWatch(vm);
    // }
}

function proxy(target, sourceKey, key) {
    Object.defineProperty(target, key, {
        get() {
            return target[sourceKey][key];
        },
        set(newValue) {
            target[sourceKey][key] = newValue;
        }
    })
}

function initData(vm) {
    let data = vm.$options.data;
    // Vue2使用Object.defineProperty对数据进行劫持

    data = vm._data = isFunction(data) ? data.call(vm) : data;
    // console.log(data)

    for (let key in data) {
        proxy(vm, '_data', key);
    } // 将_data中的数据全部代理到vm上

    observe(data);  // 观测数据
}
