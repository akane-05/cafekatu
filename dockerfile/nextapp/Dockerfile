FROM node:16-alpine AS builder

#node:alpineで不足しがちな共有ライブラリを追加
RUN apk add --no-cache libc6-compat 
WORKDIR /nextapp
#匿名での情報収集を拒否する設定
ENV NEXT_TELEMETRY_DISABLED 1

COPY package.json yarn.lock ./

#yarn.lockから依存関係をインストール
RUN yarn install --frozen-lockfile

COPY tsconfig.json next.config.js next-env.d.ts ./

COPY public/ ./public/
COPY src/ ./src/

FROM node:16-alpine as runner
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /nextapp/next.config.js next.config.js 
COPY --from=builder /nextapp/tsconfig.json tsconfig.json

COPY --from=builder /nextapp/public/ public/
COPY --from=builder /nextapp/src src/
COPY --from=builder /nextapp/node_modules/ node_modules/

COPY --from=builder /nextapp/package.json package.json
COPY --from=builder /nextapp/yarn.lock yarn.lock

CMD ["yarn", "dev"] 