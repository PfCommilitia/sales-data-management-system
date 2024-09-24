# 基于Electron、React和MUI的销售数据管理系统

## 声明

- 该项目在GitHub上通过MIT协议开源，仓库地址为：https://github.com/PfCommilitia/sales-data-management-system

- 该项目基于模板开发：https://github.com/hellosoftware-io/electron-typescript-react-material-ui
- 数据管理和用户界面设计未参考或套用其他个人或团体的工作成果

- 该项目开发过程中使用了生成式AI

## 主要技术

[Node.js](https://nodejs.org/)：开源跨平台JavaScript运行环境，适用于高并发需求的开发。

[Electron](https://www.electronjs.org/)：基于Node.js和Chromium的跨平台GUI应用框架。

[React](https://react.dev/)：前端JavaScript工具库，构建基于UI组件的用户界面。

[MUI](https://mui.com/)：原Material UI，遵循Google界面设计哲学的React工具库。

[TypeScript](https://www.typescriptlang.org/)：微软开发的JavaScript超集，提供静态类型检查等功能。

## 思路

### 数据结构

使用`ProductType`、`Product`、`Operator`、`Modifier`四个类和`ModifierType`枚举存储数据。

### 文件结构

类的每个实例都存储为一个`.json`文件，实例之间的连接通过`id`实现。

此外，数据目录根目录下存在`meta`文件，描述此数据目录中的对象数量；`index`文件是将字符串内部名与`id`进行关联的文件，在GUI界面中，由于可以直接选择对象，故没有作用；`localization`对应内部名和显示名。

## 构建

我们不会以Releases形式发布构建后的项目，项目本身不包含Node.js环境、包以及可执行文件。

为执行此项目你需要遵循以下步骤。

### 1. 配置环境

你需要在计算机上安装以下程序：

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)，版本不低于16.13.0。建议直接安装最新稳定版本。
- NPM，通常随附于Node.js中。确认你的NPM包管理器的版本不低于7.0.0。

Node.js为跨平台环境，主流的Windows，MacOS和Linux系统均可执行此项目。对于大部分Linux发行版，你可能需要配置GUI环境才能正常执行此项目。

### 2. 下载源码

在计算机上新建一个空白目录作为项目目录。在该目录中，执行以下命令：

```cmd
git clone https://github.com/PfCommilitia/sales-data-management-system .
```

这将从GitHub上下载源码到该项目目录中。

你也可以直接将分支下载为压缩包解压到项目目录中。如不考虑与git交互，两种方式没有区别。

### 3. 安装所需包

在项目目录中，执行以下命令：

```cmd
npm install
```

如需要确认，一律输入`y`同意。

NPM将会从包托管平台上下载并安装所需的包。如果你的网络环境不佳，请自行配置镜像源。

### 4. 构建/运行项目

可通过开发或生产模式构建/运行项目。

#### 开发模式

在项目目录中，执行以下命令：

```cmd
npm run dev
```

Node.js将会构建项目并在4000端口执行。在开发模式中，修改非Electron代码会触发热更新，便于进行调试。

#### 生产模式

在项目目录中，执行以下命令：

```cmd
npm run package
```

Node.js将会构建整个项目，并在项目目录的`packages`目录下输出。生产模式将会构建可以脱离Node.js环境运行的可执行文件及相关文件。

## 改进方向

由于开发时思路产生多次变化，许多设计已经不再是最优选项。可以进行的优化包括：

重构代码，优化代码结构，减少冗余，提高运行效率；在列表视图添加分页功能。

