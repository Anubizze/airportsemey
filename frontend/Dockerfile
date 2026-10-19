FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN printf 'nameserver 8.8.8.8\nnameserver 1.1.1.1\n' > /etc/resolv.conf \
  && npm ci --no-audit --no-fund \
  && test -x node_modules/.bin/next

COPY . .

ARG NEXT_PUBLIC_API_BASE_URL=https://abaiairport.kz/api
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
