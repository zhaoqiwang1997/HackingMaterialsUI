arg APP_NAME=hacking_materials_frontend
arg APP_PATH=/opt/$APP_NAME

# Stage 1: Build
from node:latest as builder

arg APP_NAME
arg APP_PATH

workdir $APP_PATH

copy .env tsconfig.json package.json package-lock.json src public ./
copy src ./src
copy public ./public

run npm install --legacy-peer-deps
run npm run build

# Put this after install/build so that we don't need to rebuild when the nginx
# configuration changes
copy nginx ./nginx

# Stage 2: Production
from nginx:latest as production

arg APP_NAME
arg APP_PATH

copy --from=builder $APP_PATH/nginx/nginx.conf /etc/nginx/conf.d/default.conf
copy --from=builder $APP_PATH/build /usr/share/nginx/html
