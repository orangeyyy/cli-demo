module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  parser: require.resolve("@typescript-eslint/parser"),
  extends: [
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    // 数组类型始终使用[]格式声明
    "@typescript-eslint/array-type": "error",
    // 缩进固定为2空格
    "@typescript-eslint/indent": ["error", 2],
    // 禁止变量在声明前使用：取消
    "@typescript-eslint/no-use-before-define": 0,
    // interface的名称前缀必须为I
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": true
        }
      }
    ],
    // class的方法必须声明public/private，constructors除外
    "@typescript-eslint/explicit-member-accessibility": ["error", {
      accessibility: 'no-public',
    }],
  }
};