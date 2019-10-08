# Create the container from the alpine linux image
FROM alpine:3.7
# (Don't set 3.8, currently it won't work: npm problems)

# Add nginx and nodejs
RUN apk add --update nginx nodejs

# Create the directories we will need
RUN mkdir -p /tmp/nginx/react-webapp
RUN mkdir -p /var/log/nginx
RUN mkdir -p /var/www/html

# Copy the respective nginx configuration files
COPY NGINXCONFIGDIR/nginx.conf /etc/nginx/nginx.conf
COPY NGINXCONFIGDIR/default.conf /etc/nginx/conf.d/default.conf

COPY NGINXCONFIGDIR/*.crt /etc/nginx/
COPY NGINXCONFIGDIR/*.key /etc/nginx/

# Set the directory we want to run the next commands for
WORKDIR /tmp/nginx/react-webapp
# Copy our source code into the container
COPY . .
# Install the dependencies, can be commented out if you're running the same node version
RUN npm install

# run webpack and the react-loader
RUN npm run build

# copy the built app to our served directory
RUN cp -r build/* /var/www/html

# make all files belong to the nginx user
RUN chown nginx:nginx /var/www/html

RUN chown nginx:nginx /etc/nginx/*.key /etc/nginx/*.crt
RUN chmod 400 /etc/nginx/*.key /etc/nginx/*.crt

# start nginx and keep the process from backgrounding and the container from quitting
CMD ["nginx", "-g", "daemon off;"]
