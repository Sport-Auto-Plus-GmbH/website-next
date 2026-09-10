# To use this Dockerfile, you have to set `output: 'standalone'` in next.config.ts.
# Mirrors the old Payload repo's Dockerfile pattern (the old Website-4.0 repo's Dockerfile
# is Angular/nginx-specific and doesn't apply to this Next.js stack): the CI workflow
# (c_build_and_deploy.yml) builds on the host first (pnpm build), so this image just
# installs production dependencies and copies the already-built standalone output in — it
# does not rebuild from source itself.
#
# Not ported from the old Website-4.0 repo: its Azure Web-Shell SSH debug access
# (docker-resources/azure-entrypoint.sh, sshd_config) — add it deliberately later if this
# project needs the same SSH-into-the-container debugging setup.
FROM node:22.17.0-alpine
WORKDIR /app

ENV NODE_ENV production

# For build caching: copy only package files first
COPY package.json pnpm-lock.yaml ./

# FontAwesome auth mounted as a BuildKit secret (see c_build_and_deploy.yml's
# `docker build --secret id=npmrc,src=.npmrc`) rather than baked into the image. Requires
# package.json's "prepare" script to tolerate `husky` being unavailable (`husky || true`)
# — it's a devDependency, and this is a --prod-only install.
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    corepack enable && pnpm install --prod --frozen-lockfile

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --chown=nextjs:nodejs .next/standalone ./
COPY --chown=nextjs:nodejs .next/static ./.next/static
COPY --chown=nextjs:nodejs public ./public

USER nextjs

EXPOSE 3001

ENV PORT 3001

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
