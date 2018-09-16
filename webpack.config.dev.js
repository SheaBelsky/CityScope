const dotenv = require("dotenv");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
const webpack = require("webpack");

const PUBLIC_PATH = "http://localhost:3000/";

// Environment variables
// call dotenv and it will return an Object with a parsed key
const env = dotenv.config().parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});


const plugins = [
    new ExtractTextPlugin({
        filename: "css/styles.css",
    }),
    new SWPrecacheWebpackPlugin({
        cacheId: "CityScope",
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: "service-worker.js",
        minify: true,
        navigateFallback: `${PUBLIC_PATH}index.html`,
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new webpack.DefinePlugin(envKeys),
];

module.exports = {
    entry: `${__dirname}/client/src/index.js`,
    output: {
        path: `${__dirname}/client/dist`,
        publicPath: PUBLIC_PATH,
        filename: "js/bundle.js",
    },
    devtool: "eval-source-map",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                }),
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "less-loader"],
                }),
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: "url-loader?limit=100000",
                        options: {
                            name: "css/[hash].[ext]",
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader?limit=100000",
                        options: {
                            name: "img/[name].[ext]",
                        },
                    },
                    "img-loader",
                ],
            },
            {
                test: /\.(ico|pdf)$/i,
                use: [
                    "file-loader?name=img/[name].[ext]",
                ],
            },
        ],
    },
    plugins,
};
