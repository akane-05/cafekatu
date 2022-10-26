
FROM node:16-alpine

#node:alpineで不足しがちな共有ライブラリを追加
RUN apk add --no-cache libc6-compat 
WORKDIR /nextapp
#匿名での情報収集を拒否する設定
ENV NEXT_TELEMETRY_DISABLED 1

COPY package.json yarn.lock ./

#package-lock.json から依存関係をインストール
#y--frozen-lockfileをつけることでyarn.lockを更新しない
RUN yarn install --frozen-lockfile && yarn cache clean

COPY tsconfig.json next.config.js next-env.d.ts ./
COPY public/ ./public/
COPY src/ ./src/

CMD ["yarn", "dev"]