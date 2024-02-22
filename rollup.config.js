import babel from 'rollup-plugin-babel';
export default {
    input: './src/index.js',
    output: {
        format: 'umd',  // 支持amd 和 commonjs规范 window.Vue
        name: 'Vue',
        file: 'dist/vue.js',
        sourcemap: true, // es6 -> es5
    },
    plugins: [
        babel({ // 使用babel插件转化，但排除node_modules下的文件
            exclude: 'node_modules/**'
        })
    ]
}