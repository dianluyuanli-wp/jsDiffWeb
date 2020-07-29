const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app: ['./entry/index.js']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "common",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    minSize: 30000,   //  注释掉的话也不会打出来
                    minChunks: 1,   //  如果是2的话一个也抽不出来，因为好多只用了一次
                    priority: 8 // 优先级
                }
            },
        },
    },
    plugins: [
        new MiniCssExtractPlugin({      //对css进行打包，webpack4推荐语法
            filename: "[name].css",
            chunkFilename: "[name].css"
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: [
                                '@babel/react', 
                                '@babel/preset-env'
                            ],
                            plugins: [
                                //  给antd做按需加载
                                ["import", {
                                    "libraryName": "antd",
                                    //"libraryDirectory": "es",
                                    "style": 'css' // `style: true` 会加载 less 文件
                                }],
                                //  这个拿来做注入代码优化的
                                ['@babel/plugin-transform-runtime',
                                {
                                    "corejs": false,
                                    "helpers": true,
                                    "regenerator": true,
                                    "useESModules": false
                                }],
                                //  支持类写法
                                "@babel/plugin-proposal-class-properties",
                                '@babel/plugin-proposal-optional-chaining'
                            ]
                        }
                    }
                ]
            },
            {
                //  专门处理antd的css样式
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ],
            },
            {
                //  正常的css使用css module
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?modules&localIdentName=[name]__[local]--[hash:base64:5]'
                ]
            }
        ]
    },
    //  mode:"development",
    mode:"production",
}