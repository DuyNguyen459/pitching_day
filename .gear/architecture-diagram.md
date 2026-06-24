# アーキテクチャ構成図

> バージョン: 1 | 更新日時: 2026/6/24 15:38:56

リアルタイムQ&Aおよび投票機能を備えたイベントプラットフォームのシステム構成

**クライアント層:**
- 参加者/審査員
- 運営者
- イベントWebアプリ [React/Vite]

**ゲートウェイ層:**
- CDN [CloudFront ※要確認]
- ALB [AWS ALB]

**アプリケーション層:**
- APIサーバー [Node.js (NestJS)]
- リアルタイム配信サービス [Socket.io]

**データ層:**
- メインデータベース [PostgreSQL (RDS)]
- キャッシュ/セッション [Redis (ElastiCache)]

**接続:**
- 参加者/審査員 → イベントWebアプリ (HTTPS)
- 運営者 → イベントWebアプリ (HTTPS)
- イベントWebアプリ → CDN (HTTPS)
- CDN → ALB (HTTPS)
- ALB → APIサーバー (HTTP)
- イベントWebアプリ → リアルタイム配信サービス (WebSocket)
- APIサーバー → メインデータベース (SQL)
- APIサーバー → キャッシュ/セッション (Redis)
- リアルタイム配信サービス → キャッシュ/セッション (Pub/Sub)

```mermaid
flowchart TD
    subgraph client["クライアント層"]
        user["参加者/審査員"]
        admin["運営者"]
        web_spa["イベントWebアプリ (React/Vite)"]
    end
    subgraph gateway["ゲートウェイ層"]
        cdn["CDN (CloudFront ※要確認)"]
        lb["ALB (AWS ALB)"]
    end
    subgraph application["アプリケーション層"]
        api_server["APIサーバー (Node.js (NestJS))"]
        realtime_service["リアルタイム配信サービス (Socket.io)"]
    end
    subgraph data["データ層"]
        db[("メインデータベース (PostgreSQL (RDS))")]
        cache["キャッシュ/セッション (Redis (ElastiCache))"]
    end
    user -->|"HTTPS"|web_spa
    admin -->|"HTTPS"|web_spa
    web_spa -->|"HTTPS"|cdn
    cdn -->|"HTTPS"|lb
    lb -->|"HTTP"|api_server
    web_spa -->|"WebSocket"|realtime_service
    api_server -->|"SQL"|db
    api_server -->|"Redis"|cache
    realtime_service -->|"Pub/Sub"|cache
```
