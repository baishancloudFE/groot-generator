# sl-generator
> SL应用生成器
### 安装
首先确保你已经安装了 [Node.js](http://nodejs.org/) ，然后，请执行以下命令：
> npm install -g sl-generator
### 使用说明
#### 代码调用
``` javascript
const generator = require('sl-generator')

// 初始化 igroot 应用
generator.init('new project name')

// 新增模板与组件
generator.add('page name', 'component name')
```
#### 命令调用(开发调试用)
``` bash
# 生成初始项目模板
sl-generator init [name]

##################################################################
# 注意：以下命令的执行依赖于当前路径，因此，请在项目根目录中使用 #
##################################################################

# 生成页面
sl-generator add -p [name]

# 生成组件
sl-generator add -c [name]
```