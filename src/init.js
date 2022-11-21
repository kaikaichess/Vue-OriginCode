import { compileToFunction } from "./compiler/index.js";
import { initState } from "./state";

export function initMixin(Vue) {
    // 给Vue增加init方法
    Vue.prototype._init = function (options) {
        // 用于初始化
        const vm = this;
        vm.$options = options; // 将用户的选项挂载到实例上

        // 初始化状态
        initState(vm);

        if (options.el) {
            vm.$mount(options.el); // 实现数据的挂载
        }
    };
    Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el);
        let ops = vm.$options;
        let template;
        if (!ops.render) {
            if (!ops.template && el) {
                // 没有template模板但是有el
                template = el.outerHTML;
            } else {
                if (el) {
                    template = ops.template; // 如果有el则采用模板内容
                }
            }

            if (template) {
                // 对模板进行编译
                const render = compileToFunction(template);
                ops.render = render;
            }
        }
        ops.render; // 最后执行render方法
    };
}
