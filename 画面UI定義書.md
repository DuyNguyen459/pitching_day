# 画面UI定義書

> バージョン: 1 | 更新日時: 2026/6/24 15:46:20

## [SCR-001] 管理用ダッシュボード（ホーム）

- **カテゴリ:** マスタ管理
- **targetUser:** システム管理者
- **overview:** 登録されているイベントの一覧を表示し、各イベントの詳細設定や管理画面への遷移を行うメインハブ。
**コンポーネント:**

| name | type | 説明 |
| --- | --- | --- |
| header | header | 管理者用ヘッダー |
| eventList | table | イベント一覧（イベント名、開催日時、操作アクション） |
| addButton | button-group | 新規イベント作成ボタン |

**operationSteps:**

| step | action | systemResponse |
| --- | --- | --- |
| 1 | イベント一覧を表示 | DBから全イベント情報を取得し表示 |
| 2 | 「編集」ボタンクリック | 対象イベントの編集画面へ遷移 |

**fields:**


**events:**

| トリガー | action | 説明 |
| --- | --- | --- |
| addButtonClick | 遷移 | 新規イベント作成画面へ移動 |

**transitions:**

| action | destination | condition |
| --- | --- | --- |
| clickEdit | SCR-002 | イベントID選択時 |


## [SCR-002] イベント設定・QR生成画面

- **カテゴリ:** マスタ管理
- **targetUser:** システム管理者
- **overview:** イベントの基本情報（名称、日時）の登録・更新を行い、参加用QRコードを生成する。
**コンポーネント:**

| name | type | 説明 |
| --- | --- | --- |
| eventForm | form | イベント情報入力フォーム |
| qrSection | card | QRコード表示およびダウンロードエリア |

**operationSteps:**

| step | action | systemResponse |
| --- | --- | --- |
| 1 | 各項目を入力 | 入力値を検証 |
| 2 | 保存ボタン押下 | DBを更新しQRコードを再生成 |

**fields:**

| name | type | required | バリデーション | 説明 |
| --- | --- | --- | --- | --- |
| event_name | text | true | 最大255文字 | イベント名称 |
| start_time | date | true | 現在時刻以降 | 開始日時 |
| end_time | date | true | 開始日時以降 | 終了日時 |

**events:**

| トリガー | action | 説明 |
| --- | --- | --- |
| saveButtonClick | API呼び出し | イベント情報の保存とQR更新 |

**transitions:**

| action | destination | condition |
| --- | --- | --- |
| saveSuccess | SCR-001 | 保存成功時 |


## [SCR-003] プロジェクト管理画面

- **カテゴリ:** マスタ管理
- **targetUser:** システム管理者
- **overview:** イベントに紐づく発表プロジェクトを登録・管理し、発表ステータスを制御する。
**コンポーネント:**

| name | type | 説明 |
| --- | --- | --- |
| projectTable | table | プロジェクト一覧と現在のステータス |
| statusToggle | button-group | 準備中/発表中/終了の切り替えボタン |

**operationSteps:**

| step | action | systemResponse |
| --- | --- | --- |
| 1 | プロジェクト追加 | 新規レコード作成 |
| 2 | ステータス変更 | プロジェクト状態を更新 |

**fields:**

| name | type | required | バリデーション | 説明 |
| --- | --- | --- | --- | --- |
| project_name | text | true | 最大255文字 | プロジェクト名 |

**events:**

| トリガー | action | 説明 |
| --- | --- | --- |
| toggleStatus | API更新 | ステータスの状態変更を実行 |

**transitions:**



## [SCR-004] 質問検閲ダッシュボード

- **カテゴリ:** トランザクション
- **targetUser:** 運営者
- **overview:** 参加者から投稿された「未承認」の質問を一覧し、表示可否を判定する。
**コンポーネント:**

| name | type | 説明 |
| --- | --- | --- |
| pendingQuestionTable | table | 未承認質問一覧 |
| actionButtons | button-group | 承認・却下ボタン |

**operationSteps:**

| step | action | systemResponse |
| --- | --- | --- |
| 1 | 質問を確認 | 未承認データをリスト表示 |
| 2 | 「承認」または「却下」をクリック | ステータスを更新し一覧から除外 |

**fields:**


**events:**

| トリガー | action | 説明 |
| --- | --- | --- |
| approveButtonClick | API実行 | ステータスを「承認」に変更 |
| rejectButtonClick | API実行 | ステータスを「却下」に変更 |

**transitions:**



## [SCR-005] 参加者用Q&A・投票画面

- **カテゴリ:** トランザクション
- **targetUser:** イベント参加者
- **overview:** イベント中に質問を投稿したり、プロジェクトへ投票を行うための参加者向けメイン操作画面。
**コンポーネント:**

| name | type | 説明 |
| --- | --- | --- |
| questionForm | form | 質問入力用テキストエリアと匿名チェックボックス |
| projectVotingList | table | 投票可能なプロジェクト一覧 |

**operationSteps:**

| step | action | systemResponse |
| --- | --- | --- |
| 1 | 質問入力・送信 | 投稿を受け付け、承認待ちステータスで保存 |
| 2 | プロジェクト選択・投票 | 投票数を加算 |

**fields:**

| name | type | required | バリデーション | 説明 |
| --- | --- | --- | --- | --- |
| content | textarea | true | 文字数制限内 | 質問内容 |
| is_anonymous | checkbox | false |  | 匿名投稿フラグ |

**events:**

| トリガー | action | 説明 |
| --- | --- | --- |
| submitQuestion | API送信 | 質問の投稿処理 |
| castVote | API送信 | 投票の実行 |

**transitions:**

| action | destination | condition |
| --- | --- | --- |
| clickLiveQA | SCR-006 | Q&Aページへのリンク押下 |


## [SCR-006] ライブQ&A表示画面

- **カテゴリ:** 参加者用画面
- **targetUser:** イベント参加者
- **overview:** 運営により承認された質問と、それに対する発表チームの回答をリアルタイムで一覧表示する。
**コンポーネント:**

| name | type | 説明 |
| --- | --- | --- |
| Header | header | 現在のイベント名を表示 |
| QuestionList | table | 承認済みの質問と回答のリスト表示 |

**operationSteps:**

| step | action | systemResponse |
| --- | --- | --- |
| 1 | 画面を表示する | WebSocket経由で最新の承認済み質問リストを取得し表示する |

**fields:**


**events:**

| トリガー | action | 説明 |
| --- | --- | --- |
| データ更新通知 | リストの自動更新 | 新規承認された質問をリアルタイムで追加表示 |

**transitions:**



## [SCR-007] 発表チーム回答入力画面

- **カテゴリ:** 発表チーム用画面
- **targetUser:** 発表チームメンバー
- **overview:** 参加者から寄せられた質問に対し、回答を入力・投稿する専用画面。
**コンポーネント:**

| name | type | 説明 |
| --- | --- | --- |
| QuestionDetail | card | 回答対象の質問内容 |
| AnswerForm | form | 回答を入力するテキストエリアと送信ボタン |

**operationSteps:**

| step | action | systemResponse |
| --- | --- | --- |
| 1 | 質問を選択 | 回答入力フォームを表示 |
| 2 | 回答入力し送信 | 回答をデータベースに保存し質問のステータスを更新する |

**fields:**

| name | type | required | バリデーション | 説明 |
| --- | --- | --- | --- | --- |
| answer | textarea | true | 最大1000文字 | 質問に対する回答内容 |

**events:**

| トリガー | action | 説明 |
| --- | --- | --- |
| 送信ボタンクリック | 回答内容の保存 | 回答をサーバーへ送信 |

**transitions:**



## [SCR-008] Startup Wall（結果表示画面）

- **カテゴリ:** パブリック/プロジェクター用
- **targetUser:** イベント運営者/参加者
- **overview:** プロジェクター投影用の、プロジェクト投票結果およびランキングを表示するビジュアル画面。
**コンポーネント:**

| name | type | 説明 |
| --- | --- | --- |
| RankingChart | table | プロジェクトごとの得票数ランキング表 |
| StatusIndicator | card | 現在の投票状況を表示 |

**operationSteps:**

| step | action | systemResponse |
| --- | --- | --- |
| 1 | 画面表示 | 現在の投票データを集計して表示 |

**fields:**


**events:**

| トリガー | action | 説明 |
| --- | --- | --- |
| データ更新 | ランキングの再描画 | リアルタイムで投票順位を更新 |

**transitions:**



## [SCR-009] 審査員向け投票傾向分析画面

- **カテゴリ:** 審査員用管理画面
- **targetUser:** 審査員
- **overview:** 審査員が現在の観客の関心度や投票分布をリアルタイムで確認するための分析画面。
**コンポーネント:**

| name | type | 説明 |
| --- | --- | --- |
| AnalyticsChart | table | 投票数推移グラフおよびプロジェクト別投票数 |
| SummaryStats | card | 全体の総投票数やアクティブな質問数 |

**operationSteps:**

| step | action | systemResponse |
| --- | --- | --- |
| 1 | ダッシュボードを開く | 最新の投票統計データを表示 |

**fields:**


**events:**

| トリガー | action | 説明 |
| --- | --- | --- |
| 定時ポーリング | データの更新 | 最新の投票傾向データを取得し更新 |

**transitions:**


