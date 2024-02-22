import {createElement, createTextElement} from "./vdom/index.js";

export function renderMixin(Vue) {

    Vue.prototype._c = function () {  // 创建元素的虚拟节点
        return createElement(this, ...arguments);
    }
    Vue.prototype._v = function (text) {  // 创建文本的虚拟节点
        return createTextElement(this, ...arguments);
    }
    Vue.prototype._s = function (val) {  // 转化成字符串
        if (typeof val === 'object') return JSON.stringify(val);
        return val;
    }
    Vue.prototype._render = function () {
        // console.log('_render')
        const vm = this;
        const { render } = vm.$options;
        let vnode = render.call(vm);
        return vnode;
    }
}