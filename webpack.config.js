const HtmlWebPackPlugin = require("html-webpack-plugin")
const path = require("path")

module.exports = {
	entry: ["./src/main.js"],
	resolve: {
		extensions: [".js"]
	},
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				exclude: /(node_modules|bower_components)/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					plugins: [
						["@babel/plugin-transform-runtime"]
					]
				}
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader"
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./public/index.html",
			filename: "./index.html"
		})
	],
	devtool: "source-map",
	devServer: {
		port: 3030,
		contentBase: path.join(__dirname, "public"),
		compress: true,
		historyApiFallback: false
	}
}
