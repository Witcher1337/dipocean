
FROM node:16-alpine as base
WORKDIR /app

RUN apk --no-cache add --virtual .builds-deps build-base python3

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder

COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY package.json /app/package.json
# RUN npm run codegen
# RUN npm run lint
RUN yarn build --prod --noninteractive
RUN yarn add --frozen-lockfile --ignore-scripts --audit=false

# Production image, copy all the files and run next
FROM base AS runner

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S ssr-dipocean -u 1001

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER ssr-dipocean

EXPOSE 3000

ENV PORT 3000

EXPOSE 3000

CMD [ "yarn", "run", "start:prod" ]