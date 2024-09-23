# 基于Electron、React和MUI的销售数据管理系统

## 声明

该项目基于该模板开发。该模板不包含任何业务逻辑代码：https://github.com/hellosoftware-io/electron-typescript-react-material-ui

该项目开发过程中使用了生成式AI。

## 主要技术

Node.js：开源跨平台JavaScript运行环境，适用于高并发需求的开发。

Electron：基于Node.js和Chromium的跨平台GUI应用框架。

React：前端JavaScript工具库，构建基于UI组件的用户界面。

MUI：原Material UI，遵循Google界面设计哲学的React工具库。

TypeScript：微软开发的JavaScript超集，提供静态类型检查等功能。

## 思路

### 数据结构

使用ProductType、Product、Operator、Modifier四个类和ModifierType枚举存储数据。

### 文件结构

类的每个实例都存储为一个JSON文件，实例之间的连接通过id实现。

此外，数据目录根目录下存在meta文件，描述此数据目录中的对象数量；index文件是将字符串内部名与id进行关联的文件，在GUI界面中，由于可以直接选择对象，故没有作用；localization对应内部名和显示名。

## 改进方向

由于开发时思路产生多次变化，许多设计已经不再是最优选项。可以进行的优化包括：

重构代码，优化代码结构，减少冗余，提高运行效率；在列表视图添加分页功能。

