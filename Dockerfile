# syntax=docker/dockerfile:1
# Node 26 LTS: keep it in step with .nvmrc (Dependabot ignores Node majors; move with the next LTS).

FROM node:26-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# The token is a BuildKit secret, so it never lands in a layer.
RUN --mount=type=secret,id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN \
    printf '%s\n' '@thebensage-dev:registry=https://npm.pkg.github.com' \
      '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' > .npmrc \
    && npm ci \
    && rm .npmrc

FROM node:26-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# sharp is only for next/image, which this site doesn't use.
RUN rm -rf .next/standalone/node_modules/sharp .next/standalone/node_modules/@img

FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q --spider "http://127.0.0.1:${PORT}/" || exit 1

CMD ["node", "server.js"]
