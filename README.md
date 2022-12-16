# Cafe活

全国のカフェ、喫茶店を検索、口コミを投稿できるグルメアプリです。
ユーザーがカフェの情報を検索、投稿、口コミを投稿、お気に入りのカフェを記録することができます。

![image](https://user-images.githubusercontent.com/108785532/207331736-1757371f-d915-498b-926c-bfeec2c41561.png)
![image](https://user-images.githubusercontent.com/108785532/207332029-7f266bb4-cdbc-4c6d-96c2-863decd3eb1d.png)
![image](https://user-images.githubusercontent.com/108785532/207333031-28a5ae54-e027-4f37-8fc9-2c103f1908b3.png)
![image](https://user-images.githubusercontent.com/108785532/207332550-d24f7395-ab10-4c1f-9b99-e33bf3d9551f.png)

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
* AWSにサーバーを構築、アプリケーションを公開

## 設計
### デザイン
figmaで公開してます。
当初のデザインと実装は一部異なる部分があります。
https://www.figma.com/file/Bk9Aq67HIaT26ymqCPmyHY/Cafe%E6%B4%BB?node-id=0%3A1&t=hjiQBFtEGHHDeVjM-1

### API設計
stoplight studioで作図しました。
リポジトリにyamlファイルがあります。

https://github.com/akane-05/cafekatu/blob/main/cafekatu.yaml

### ER図
draw.ioを用いて作図しました。
![image](https://user-images.githubusercontent.com/108785532/207324167-c656185c-aa14-4fe4-b069-aefa931deb97.png)


