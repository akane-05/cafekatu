# Cafe活

全国のカフェ、喫茶店を検索、口コミを投稿できるグルメアプリです。
ユーザーがカフェの情報を検索、投稿、口コミを投稿、お気に入りのカフェを記録することができます。

## URL
現在は公開を停止してます。(https://cafekatu.com)

* 常時SSL化。
* ゲストログイン出来ます。
* レスポンシブデザイン対応。

以下のリンクから、動画で一部機能のデモンストレーションをご確認いただけます。

ユーザー機能(ログイン、ログアウト、新規会員登録、変更、退会)<br>
https://raw.github.com/wiki/akane-05/cafekatu/userfunc.gif

カフェ検索、レビュー投稿<br>
https://raw.github.com/wiki/akane-05/cafekatu/cafefunc.gif

## インフラ構成図
<img width="1064" alt="スクリーンショット 2023-01-24 12 21 21" src="https://user-images.githubusercontent.com/108785532/214205932-7fca1181-71f5-45b3-991e-baf416da9584.png">


## 使用技術
### 設計
* draw.io (テーブル設計)
* Figma （アプリケーションのデザイン）
* Stoplight Studio (API設計)

### バックエンド
* Golang 1.18.8
* gin
* Mysql 8.0

### フロントエンド
* TypeScript
* Next.js 12.2.5
* Material-UI 5.10.1

### インフラ・開発環境
* Git/GitHub
* Docker/Docker-compose
* github Action

## 実装した機能
* ログイン、ログアウト機能
* 新規会員登録機能
* ユーザー情報変更機能
* 退会機能
* 店舗検索機能
* 店舗情報投稿機能
* お気に入り登録、削除機能
* コメント投稿、、削除機能
* お気に入り、コメントを投稿した店舗の確認機能

## 実装予定の機能
* 画像投稿機能
* 自動テスト

## 設計
### デザイン
figmaで公開してます。
当初のデザインと実装は一部異なる部分があります。
https://www.figma.com/file/Bk9Aq67HIaT26ymqCPmyHY/Cafe%E6%B4%BB?node-id=0%3A1&t=hjiQBFtEGHHDeVjM-1

### API設計
stoplight studioで作図しました。
リポジトリにyamlファイルがあります。　<br>
https://github.com/akane-05/cafekatu/blob/main/cafekatu.yaml


### ER図
draw.ioを用いて作図しました。
![image](https://user-images.githubusercontent.com/108785532/207324167-c656185c-aa14-4fe4-b069-aefa931deb97.png)


