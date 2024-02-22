
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        console.log('_update', vnode)
    }
}


export function mountComponent(vm, el) {
    // 更新函数 数据变化后 会再次调用此函数
    let updateComponent = () => {
        // 调用render函数，生成虚拟DOM
        vm._update(vm._render());
    }
    // 观察者模式： 属性是被观察者 刷新页面是观察者
    updateComponent();
    // new Watcher(vm, updateComponent, () => {
    //     console.log('更新视图了');
    // }, true); // true表示他是一个渲染watcher
}