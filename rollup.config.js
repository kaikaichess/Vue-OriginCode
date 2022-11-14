// rollup默认可以导出一个对象，作为打包的配置文件
import babel from "rollup-plugin-babel";
export default {
  input: "./src/index.js", // 入口文件
  output: {
    file: "./dist/vue.js", // 出口文件
    name: "Vue", // global.Vue
    format: "umd", // 打包的格式（esm、ES6模块、commonjs、iife自执行函数、umd）
    sourcemap: true, //希望可以调试源代码
  },
  plugins: [
    // 插件
    babel({
      exclude: "node_modules/**", // 打包排除node_modules下的文件
    }),
  ],
};
