# API仕様書

> バージョン: 1 | 更新日時: 2026/6/24 15:38:50

## 項目 1

- **endpoint:** /api/events
- **method:** GET
- **summary:** イベント一覧取得
- **説明:** 開催イベントの一覧をページネーション付きで取得する
- **カテゴリ:** イベント管理
- **relatedScreen:** イベント一覧
**auth:**

- required: true
- type: Bearer Token
- permissions: admin

**queryParameters:**

| name | type | required | default | 説明 |
| --- | --- | --- | --- | --- |
| page | number | false | 1 | ページ番号 |
| limit | number | false | 20 | 1ページあたりの件数 |

**responses:**

- 200: [object Object]


## 項目 2

- **endpoint:** /api/events
- **method:** POST
- **summary:** イベント作成
- **説明:** 新しいイベントを作成する
- **カテゴリ:** イベント管理
- **relatedScreen:** イベント登録画面
**auth:**

- required: true
- type: Bearer Token
- permissions: admin

**requestBody:**

- contentType: application/json
- fields: [object Object],[object Object],[object Object]
- example: [object Object]

**responses:**

- 201: [object Object]


## 項目 3

- **endpoint:** /api/projects
- **method:** GET
- **summary:** プロジェクト一覧取得
- **説明:** プロジェクト情報を一覧で取得する
- **カテゴリ:** プロジェクト管理
- **relatedScreen:** 発表管理画面
**auth:**

- required: true
- type: Bearer Token
- permissions: admin

**responses:**

- 200: [object Object]


## 項目 4

- **endpoint:** /api/projects/{id}
- **method:** PATCH
- **summary:** プロジェクト更新
- **説明:** プロジェクトのステータス等を更新する
- **カテゴリ:** プロジェクト管理
- **relatedScreen:** 発表管理画面
**auth:**

- required: true
- type: Bearer Token
- permissions: admin

**pathParameters:**

| name | type | required | 説明 |
| --- | --- | --- | --- |
| id | string | true | プロジェクトID |

**requestBody:**

- contentType: application/json
- fields: [object Object]
- example: [object Object]

**responses:**

- 200: [object Object]


## 項目 5

- **endpoint:** /api/questions
- **method:** POST
- **summary:** 質問投稿
- **説明:** 参加者がイベントに対して質問を投稿する
- **カテゴリ:** Q&A管理
- **relatedScreen:** 質問投稿画面
**auth:**

- required: true
- type: Bearer Token
- permissions: user

**requestBody:**

- contentType: application/json
- fields: [object Object],[object Object],[object Object]
- example: [object Object]

**responses:**

- 201: [object Object]


## 項目 6

- **endpoint:** /api/questions/{id}
- **method:** PATCH
- **summary:** 質問ステータス更新（検閲）
- **説明:** 管理者が質問の承認・却下を行う
- **カテゴリ:** Q&A管理
- **relatedScreen:** 質問検閲ダッシュボード
**auth:**

- required: true
- type: Bearer Token
- permissions: admin

**pathParameters:**

| name | type | required | 説明 |
| --- | --- | --- | --- |
| id | string | true | 質問ID |

**requestBody:**

- contentType: application/json
- fields: [object Object]
- example: [object Object]

**responses:**

- 200: [object Object]


## 項目 7

- **endpoint:** /api/votes
- **method:** POST
- **summary:** プロジェクトへ投票
- **説明:** 参加者がプロジェクトに投票する
- **カテゴリ:** 投票機能
- **relatedScreen:** 投票画面
**auth:**

- required: true
- type: Bearer Token
- permissions: user

**requestBody:**

- contentType: application/json
- fields: [object Object]
- example: [object Object]

**responses:**

- 201: [object Object]
- 400: [object Object]


## 項目 8

- **endpoint:** /api/admin/system/monitor
- **method:** POST
- **summary:** イベント監視バッチ実行
- **説明:** イベントの受付状態を強制的に再評価する（システム内部用）※要確認
- **カテゴリ:** バッチ
- **relatedScreen:** なし
**auth:**

- required: true
- type: Bearer Token
- permissions: system

**responses:**

- 200: [object Object]


## 項目 9

- **endpoint:** /api/admin/reports/export
- **method:** GET
- **summary:** データエクスポート
- **説明:** Q&Aおよび投票結果をCSVで取得する
- **カテゴリ:** バッチ
- **relatedScreen:** なし
**auth:**

- required: true
- type: Bearer Token
- permissions: admin

**queryParameters:**

| name | type | required | 説明 |
| --- | --- | --- | --- |
| event_id | string | true | イベントID |

**responses:**

- 200: [object Object]


## 項目 10

- **endpoint:** /api/admin/events/{event_id}/export
- **method:** GET
- **summary:** イベントデータの集計CSVダウンロード
- **説明:** 指定されたイベントの質問内容および投票結果を集計し、CSVファイルとして提供する。イベント終了後のみ実行可能。※要確認：イベント終了状態の判定ロジック
- **カテゴリ:** ファイル処理
- **relatedScreen:** 管理用レポート出力画面
**auth:**

- required: true
- type: Bearer Token
- permissions: admin

**pathParameters:**

| name | type | required | 説明 |
| --- | --- | --- | --- |
| event_id | string | true | 対象イベントID |

**queryParameters:**


**requestHeaders:**

| name | required | 説明 |
| --- | --- | --- |
| Authorization | true | Bearer {token} |

**responses:**

- 200: [object Object]
- 400: [object Object]
- 401: [object Object]
- 403: [object Object]
- 500: [object Object]

- **備考:** ファイルはサーバー側で生成後にダウンロードされる。イベント期間外のアクセスは400を返す。
