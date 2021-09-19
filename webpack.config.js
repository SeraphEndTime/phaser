const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const  {CleanWebpackPlugin}  = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/main.ts",
    devtool: "source-map",
    
    output: {
        filename: "./bundle.js",
        path:path.resolve(__dirname,'dist')
    },
    resolve: {
        extensions: [".ts",".js"],
        
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'src/index.html')
        }),
        new CopyPlugin({
            
            patterns:[
                {from: path.resolve(__dirname, 'src/assets'), to:'assets'}
            ],
            options:{
                
            }
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    }
};