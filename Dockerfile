FROM node:20.18-alpine AS base
LABEL authors="AmRo045"
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 0
ENV DATABASE_URL file:/app/data/app.db

FROM base AS build
WORKDIR /app

COPY package-lock.json package.json ./
RUN npm install

COPY . ./

ENV NODE_ENV production

RUN npx prisma migrate deploy && npx prisma generate

RUN npm run compile &&  \
    npm run setup &&  \
    npm run build


FROM base AS release
WORKDIR /app

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/dist ./dist
COPY --from=build /app/data/app.db ./data/app.db

EXPOSE 3000

CMD ["npm", "run", "start"]
