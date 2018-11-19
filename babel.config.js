const presets = [
  [ "@babel/preset-env", {
		targets: { "browsers": ["ios >= 8", "android >= 4.4"] },
		useBuiltIns: "usage",
	}],
	"@babel/preset-react"
];

const plugins = [
	"react-hot-loader/babel",
	[require("@babel/plugin-proposal-class-properties"), { loose: true }],
	["import", { "libraryName": "antd-mobile", "style": "css" }]
]

module.exports = {
	presets,
	plugins
}