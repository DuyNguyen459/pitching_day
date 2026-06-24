# Implementation Rules

このドキュメントは、AIコード生成ツール（Claude Code、Cursor等）がプロジェクト「Pitching Day」の実装を行う際に参照すべきルールとガイドです。全てのコーディング作業において、まずは .gear/ ディレクトリ内の各ドキュメントを参照してください。

## Project Overview
Pitching Day: スタートアップと投資家のマッチングを円滑化するピッチイベント管理プラットフォーム。イベントの管理、エントリー管理、ピッチの評価機能を統合的に提供します。

## Document Structure
.gear/ ディレクトリ配下のドキュメント構成（参照先パス）:

| Document | File Path | Description |
|----------|-----------|-------------|
| プロジェクト概要 | .gear/project-overview.md | プロジェクトの目的・背景 |
| 業務フロー | .gear/business-flow.md | 業務ルール・フロー確認時 |
| 機能要件一覧 | .gear/functional-requirements.md | 機能の実装範囲確認時 |
| 非機能要件一覧 | .gear/non-functional-requirements.md | 性能・セキュリティ要件確認時 |
| システム概要 | .gear/system-overview.md | 全体構成の把握時 |
| テーブル定義 | .gear/table-definitions.md | DBスキーマの確認時 |
| API仕様書 | .gear/api-specification.md | APIエンドポイント実装時 |
| アーキテクチャ構成図 | .gear/architecture-diagram.md | システム構造の確認時 |
| バックエンド処理 | .gear/backend-process.md | ビジネスロジック実装時 |

## Key Implementation Rules

### 1. Database (.gear/table-definitions.md)
- データベース設計は必ず `table-definitions.md` に従ってください。
- 命名規則: スネークケース、主キーはUUIDを採用。
- トランザクション制御が必要な処理は `backend-process.md` を参照すること。

### 2. API Design (.gear/api-specification.md)
- RESTful設計を遵守すること。
- エラーレスポンス形式:
  ```json
  { "error": "ERROR_CODE", "message": "詳細なエラーメッセージ" }
  ```

### 3. Backend Implementation (.gear/backend-process.md)
- ビジネスロジックのフローは `backend-process.md` を参照し、ドメインモデルを意識した実装を行うこと。

## Quick Reference

### Error Codes
| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | 入力値不備 |
| AUTH_REQUIRED | 401 | 認証失敗 |
| PERMISSION_DENIED | 403 | 権限不足 |
| RESOURCE_NOT_FOUND | 404 | リソース不在 |
| INTERNAL_SERVER_ERROR | 500 | 予期せぬエラー |

### Conventions
- ファイル名: kebab-case
- 変数名: camelCase
- 定数: UPPER_SNAKE_CASE
- クラス/コンポーネント: PascalCase

---
【AIへの指示】
- 実装前に必ず該当する .gear/ ファイルを読み込み、現行の実装との整合性を確認すること。
- 不明な仕様がある場合は、ドキュメントの記載を優先し、矛盾がある場合はフィードバックを行うこと。
