import {initState} from "./initState";
import { compileToFunction } from "./compiler/index";
import {mountComponent} from "./lifecycle";

export function initMixin(Vue) {  // 在Vue原型上添加_init方法，做一次混合操作
    Vue.prototype._init = function (options) {
        // console.log(options);
        const vm = this;
        vm.$options = options;  // 后面可以对options进行扩展操作

        // 对数据进行初始化 watch computed props data ...
        initState(vm);

        if (vm.$options.el) {
            // 将数据挂载到这个模板上
            vm.$mount(vm.$options.el);
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el)
        // console.log(el)
        // 把模板变成渲染函数 =》 虚拟DOM概念 vnode =》 diff算法 =》 更新虚拟DOM =》产生真实节点，更新

        if (!options.render) {
            // 没有render用template，template转换成render方法
            let template = options.template;
            if (!template && el) {
                template = el.outerHTML;
                let render = compileToFunction(template);
                options.render = render;
            }
            // console.log(template)
        }
        console.log(options.render)
        mountComponent(vm, el);
    }
}