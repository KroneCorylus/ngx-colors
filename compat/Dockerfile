# syntax=docker/dockerfile:1
ARG NODE_IMAGE=node:24.18.0-alpine

FROM ${NODE_IMAGE} AS v22
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
RUN --mount=type=cache,target=/root/.npm,sharing=locked /scripts/build-one.sh 22

FROM nginx:alpine AS final
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=v22 /out/ /usr/share/nginx/html/
COPY scripts/make-index.sh /tmp/make-index.sh
RUN sh /tmp/make-index.sh /usr/share/nginx/html && rm /tmp/make-index.sh
EXPOSE 80
