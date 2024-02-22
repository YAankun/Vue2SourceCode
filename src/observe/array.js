export let arrayMethods = Object.create(Array.prototype);
// arrayMethods.__proto__ = Array.prototype; 继承
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]
// 重写这些方法，切片编程 监控的是数组中的每一项
methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        console.log('数组方法被调用了')
        const result = Array.prototype[method].call(this, ...args);
        // 对新增的数据进行观测
        let inserted;
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':  // splice(0, 1, xxx)
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        if (inserted) {
            this.__ob__.observeArray(inserted);
        }
        return result;
    }
})