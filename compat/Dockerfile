# syntax=docker/dockerfile:1
# See README.md for what this harness tests and how to add a major.

ARG NODE_IMAGE=node:22-alpine
ARG NODE_IMAGE_NEXT=node:24-alpine

FROM ${NODE_IMAGE} AS base
ENV NG_CLI_ANALYTICS=false \
    CI=1 \
    npm_config_fund=false \
    npm_config_audit=false \
    npm_config_update_notifier=false
WORKDIR /work
COPY scripts/ /scripts/
COPY app/ /app/
COPY .artifacts/ /artifacts/
RUN chmod +x /scripts/*.sh

FROM ${NODE_IMAGE_NEXT} AS base-next
ENV NG_CLI_ANALYTICS=false \
    CI=1 \
    npm_config_fund=false \
    npm_config_audit=false \
    npm_config_update_notifier=false
WORKDIR /work
COPY scripts/ /scripts/
COPY app/ /app/
COPY .artifacts/ /artifacts/
RUN chmod +x /scripts/*.sh

FROM base AS v17
RUN --mount=type=cache,target=/root/.npm,sharing=locked /scripts/build-one.sh 17

FROM base AS v18
RUN --mount=type=cache,target=/root/.npm,sharing=locked /scripts/build-one.sh 18

FROM base AS v19
RUN --mount=type=cache,target=/root/.npm,sharing=locked /scripts/build-one.sh 19

FROM base AS v20
RUN --mount=type=cache,target=/root/.npm,sharing=locked /scripts/build-one.sh 20

FROM base AS v21
RUN --mount=type=cache,target=/root/.npm,sharing=locked /scripts/build-one.sh 21

FROM base-next AS v22
RUN --mount=type=cache,target=/root/.npm,sharing=locked /scripts/build-one.sh 22

FROM nginx:alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=v17 /out/ /usr/share/nginx/html/
COPY --from=v18 /out/ /usr/share/nginx/html/
COPY --from=v19 /out/ /usr/share/nginx/html/
COPY --from=v20 /out/ /usr/share/nginx/html/
COPY --from=v21 /out/ /usr/share/nginx/html/
COPY --from=v22 /out/ /usr/share/nginx/html/
COPY scripts/make-index.sh /tmp/make-index.sh
RUN sh /tmp/make-index.sh /usr/share/nginx/html && rm /tmp/make-index.sh
EXPOSE 80
