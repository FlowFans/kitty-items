# Kitty Items API

Kitty Items API是一个由[express](https://expressjs.com/)构建的 RESTful API，它使用 [Flow JS SDK](https://github.com/onflow/flow-js-sdk/)将事务发送到 Flow。

## 从这里开始

### 1. 安装依赖

```sh
cd ./api

npm install
```

### 2. 使用 Flow testnet 的账号

你会需要 **account address** 和
**private key** 来完成以下几步.

如果你还没有测试网账号，请阅读 [Getting Started](https://github.com/onflow/kitty-items#-get-started).

```sh
# 替换你的账号信息@
export FLOW_ADDRESS=0xabcdef12345689
export FLOW_PRIVATE_KEY=xxxxxxxxxxxx
```

### 3. 配置环境

创建 `.env.example` 复制:

```sh
cp .env.example .env.local
```

### 4. 启动数据库

> 🚧 你需要安装Docker来完成这个步骤.


我们将使用包含的 `docker-compose` 文件来为这个 API 启动一个 Postgres 实例。

```sh
docker-compose up -d
```

### 5. 启动API服务器

```sh
npm run start:dev
```

### 6. 建立 minter 帐户

Before you can mint Kibbles and Kitty Items,
在你可以制作 mint Kibbles 和 Kitty Items 之前，
您将需要初始化您的帐户与以下:

- An empty `Kibble` vault
- An empty `KittyItems` collection
- An empty `KittyItemsMarket` collection

_💡 了解更多关于“Vault”和“Collection”资源的信息[in this tutorial](https://docs.onflow.org/cadence/tutorial/01-first-steps/)._

#### 铸币脚本设置

Run this script to set up the minter account and mint an initial supply of Kibble and Kitty Items:
运行这个脚本来建立 minter 账户并铸币一个初始供应的 Kibbles 和 Kitty Items :

```sh
./setup-minter.sh
```

### 试一下!

✨ API 运行在 http://localhost:3000.

_注意:当API启动时，
它将自动为已配置的' DATABASE_URL ' URL. 运行数据库迁移_

## 接下来

现在 API 已经配置好了，[启动前端应用程序](https://github.com/onflow/kitty-items/tree/master/web#readme)开始与你的新市场交互!

---

## 附录: API 参考

### 设置

运行以下命令初始化 minter 帐户持有和 mint，
Kitty Items，并添加提供给市场。

- **POST /v1/kibbles/setup** - Create a resource that holds Kibble in the `MINTER_FLOW_ADDRESS` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kibbles/setup \
  --header 'Content-Type: application/json'
```

- **POST /v1/kitty-items/setup** - Create a resource that holds Kitty Items in the `MINTER_FLOW_ADDRESS` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kitty-items/setup \
  --header 'Content-Type: application/json'
```

- **POST /v1/market/setup** - Create a resource that allows the `MINTER_FLOW_ADDRESS` to hold sale offers for Kitty Items.

```sh
curl --request POST \
  --url http://localhost:3000/v1/market/setup \
  --header 'Content-Type: application/json'
```

### 铸造

运行下面的命令来制造新的 Kibbles，创建新的 items，
列出一些待售物品。

- **POST /v1/kibbles/mint** - Mint new Kibble
  and send it to the `recipient` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kibbles/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "amount": 2.0
  }'
```

- **POST /v1/kitty-items/mint** - Mint a Kitty Item
  and send it to the `recipient` account.

```sh
curl --request POST \
  --url http://localhost:3000/v1/kitty-items/mint \
  --header 'Content-Type: application/json' \
  --data '{
    "recipient": "'$FLOW_ADDRESS'",
    "typeID": 1
  }'
```

- **POST /v1/market/sell** - Put a Kitty Item up for sale.

```sh
curl --request POST \
  --url http://localhost:3000/v1/market/sell \
  --header 'Content-Type: application/json' \
  --data '{
    "itemID": 0,
    "price": 7.9
  }'
```
