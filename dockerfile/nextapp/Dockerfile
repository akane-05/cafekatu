FROM node:16-alpine AS builder

#node:alpineで不足しがちな共有ライブラリを追加
RUN apk add --no-cache libc6-compat 
WORKDIR /nextapp
#匿名での情報収集を拒否する設定
ENV NEXT_TELEMETRY_DISABLED 1

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

COPY tsconfig.json ./tsconfig.json
COPY next.config.js ./next.config.js
COPY next-env.d.ts ./next-env.d.ts

COPY public/ ./public/
COPY src/ ./src/

#package-lock.json から依存関係をインストール
RUN npm ci 

FROM node:16-alpine as runner

#ENV NODE_ENV production
#ENV NODE_ENV dev
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /nextapp/next.config.js next.config.js 
COPY --from=builder /nextapp/tsconfig.json tsconfig.json
COPY --from=builder /nextapp/public/ public/
COPY --from=builder /nextapp/src src/
COPY --from=builder /nextapp/node_modules/ node_modules/

COPY --from=builder /nextapp/package.json package.json
COPY --from=builder /nextapp/package-lock.json package-lock.json


#RUN npm run build #JSファイルやCSSファイルをマージする、やる必要あるのか？
# CMD sh -c "npm run dev"　