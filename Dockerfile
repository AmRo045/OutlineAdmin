FROM oven/bun:1 AS base
LABEL authors="AmRo045"
WORKDIR /usr/src/app


FROM base AS build
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . ./

ENV NODE_ENV=production
ENV DATABASE_URL="file:/usr/src/app/data/app.db"

RUN bun setup
RUN bun prisma migrate deploy
RUN bun prisma generate
RUN bun run build

FROM base AS release

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.next/standalone ./
COPY --from=build /usr/src/app/.next/static ./.next/static
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/scripts ./scripts
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/data/app.db ./data/app.db

RUN chown -R bun:bun /usr/src/app

USER bun

EXPOSE 3000

CMD ["bun", "run", "start"]
