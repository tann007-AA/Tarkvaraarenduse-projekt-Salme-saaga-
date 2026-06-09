FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter backend build
RUN pnpm deploy --filter=backend --prod /prod/backend --legacy

FROM node:20-slim AS production
WORKDIR /app
COPY --from=build /prod/backend /app
EXPOSE 3000
CMD [ "node", "dist/main" ]
