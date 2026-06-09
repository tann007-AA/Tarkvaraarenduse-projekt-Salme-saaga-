FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app
# Copy only necessary files for installing dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json ./apps/backend/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the code and build
COPY . .
RUN pnpm --filter backend build

FROM base AS production
WORKDIR /app

# Copy production dependencies and built files
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=build /usr/src/app/apps/backend/package.json ./apps/backend/package.json
COPY --from=build /usr/src/app/apps/backend/dist ./apps/backend/dist

# Expose port and start
EXPOSE 3000
WORKDIR /app/apps/backend
CMD [ "node", "dist/main" ]
