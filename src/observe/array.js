// 这个文件的作用是重写部分数组方法
let oldArrayProto = Array.prototype; // 获取数组的原型

export let newArrayProto = Object.create(oldArrayProto);

let methods = [
    // 需要重写的数组方法（会改变原数组的方法）
    "push",
    "pop",
    "shift",
    "unshift",
    "reverse",
    "sort",
    "slice",
];

methods.forEach((method) => {
    newArrayProto[method] = function (...args) {
        // 这里重写了数组的方法
        const result = oldArrayProto[method].call(this, ...args); // 内部调用了原来的方法

        let inserted;
        let ob = this.__ob__;
        switch (method) {
            case "push":
            case "unshift":
                inserted = args;
                break;
            case "splice":
                inserted = args.slice(2);
            default:
                break;
        }
        if (inserted) {
            // 对新增的数据也进行观测
            ob.observeArray(inserted);
        }

        return result;
    };
});
