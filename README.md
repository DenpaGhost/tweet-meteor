# License
MIT

# Usage

## 必要な環境

- Docker Compose, Docker
- yarn

いずれか。 yarn単独での動作は確認していません。

## cp src/.env.example src/.env & edit

`src/.env`を作成し、適切な値に書き換えてください。

```src/.env
BEARER_TOKEN=xxxxxxxxxxxxxxxxxxxxx
TWEET_SEARCH_MAX_RESULTS=100
TWEET_FETCH_INTERVAL_SECOND=20
TWEET_SEARCH_QUERY="#ハッシュタグ"
VISIBLE_AUTHOR=false
```

`BEARER_TOKEN`: Twitter API v2のBearer Token

`TWEET_SEARCH_MAX_RESULTS`: 取得するツイート数(10 <= n <= 100)

`TWEET_FETCH_INTERVAL_SECOND`: ツイートの取得間隔（秒）(10 < n)

`TWEET_SEARCH_QUERY`: クエリ文字列。`-is:retweet`は必ず設定されます。

`VISIBLE_AUTHOR`: ツイートしたユーザ名を表示します。(@usernameではない) (true / false)

## docker-compose up

```shell
docker-compose up --build -d
```

## yarn install

```shell
docker-compose exec app yarn install

# use local yarn
cd src
yarn install
```

## yarn run

```shell
docker-compose exec app yarn run dev

# use local yarn (package.jsonを書き換える必要があるかも)
yarn run dev
```
