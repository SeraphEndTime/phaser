
module.exports = {
    entry: "./src/main.ts",
    devtool: "source-map",
    output: {
        filename: "./bundle.js"
    },
    resolve: {
        extensions: [".ts",".js"],
        
    },
    
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    }
};