FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter backend build

FROM base AS production
WORKDIR /app

# Copy workspace config and backend package.json
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/

# Install only production dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter backend

# Copy the compiled code from the build stage
COPY --from=build /usr/src/app/apps/backend/dist ./dist

# Symlink or move node_modules so 'node dist/main' can find them
RUN ln -s apps/backend/node_modules ./node_modules_backend
# NestJS/Node will look in ./node_modules and ../node_modules
# We ensure the app's dependencies are accessible
RUN cp -r apps/backend/node_modules/* ./node_modules/ || true

EXPOSE 3000
CMD [ "node", "dist/main" ]
