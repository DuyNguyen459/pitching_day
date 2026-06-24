# API仕様書

## 設計方針
- RESTful設計
- エラーレスポンス形式:
  ```json
  { "error": "ERROR_CODE", "message": "詳細なエラーメッセージ" }
  ```

## エンドポイント例
- `POST /api/v1/auth/login`: ログイン
- `GET /api/v1/events`: イベント一覧取得
- `POST /api/v1/events`: イベント登録
- `POST /api/v1/pitches`: ピッチ登録
- `POST /api/v1/scores`: スコア登録
