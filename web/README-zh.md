# Kitty Items 网页

- 一个使用 Flow 区块链构建的示例应用程序。
- 它的大多数特性都是由链上合约直接提供的。

你可以在下面看到这个应用程序的在线示例
[https://dark-frost-1788.on.fleek.co/](https://dark-frost-1788.on.fleek.co/).
它借助 [https://fleek.co/](https://fleek.co/)服务托管在 IPFS 上。

## 针对 Flow 测试网在本地运行

### 先决条件


在启动此应用程序之前，您需要完成以下步骤:

- [部署 Kitty Items 合约 ](https://github.com/onflow/kitty-items/tree/master/#4-deploy-the-contracts)
- [配置并启动 API 服务](https://github.com/onflow/kitty-items/tree/master/api#readme)

将 Testnet 的 Flow 地址添加到环境中:

```sh
# 替换成你自己的地址!
export FLOW_ADDRESS=0xabcdef12345689
```

### 1. 配置环境

复制一个 `.env.example` 的拷贝:

```sh
cd ./web

cp .env.example .env.local
```

### 2. 安装并运行应用程序!

```sh
npm install       # 安装依赖
npm run start:dev # 启动应用
```

## 更多


如果你想了解更多关于这里正在发生的事情，我们建议查看[FCL 快速入门指南](https://github.com/onflow/flow-js-sdk/tree/master/packages/fcl#flow-app-quickstart)。
在那里，您将看到这个项目中的许多代码相似的用例。

如果您有任何问题、评论或担忧(或只是想说声 嗨!)，我们希望您加入社区[Flow Discord服务器](https://discord.gg/k6cZ7QC)。
