# stage1
FROM node:lts-slim AS stage1
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
# stage2
FROM nginx:alpine
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=stage1 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]