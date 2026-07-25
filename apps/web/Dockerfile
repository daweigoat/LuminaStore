FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm turbo
COPY . .
RUN pnpm install
RUN turbo run build --filter=@luminastore/web

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/apps/web/next.config.ts ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
