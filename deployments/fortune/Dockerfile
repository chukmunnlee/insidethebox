# Using the node image as the base, we add other necessary files/deps to it.
FROM node:latest 

# Delcaring environment variables
ENV APP_DIR=/app APP_PORT=3000

# For documentation: to see what ports are required by the app without looking at code
EXPOSE ${APP_PORT}

# Declare app directory folder
WORKDIR ${APP_DIR}

# Copy necessary files to the specified places
# . refers to same folder.

ADD main.js .
ADD package.json .
ADD package-lock.json .
ADD public public
ADD views views

# Do not install devDependencies
RUN npm install --production

# Check if server is alive once in a while
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \    
    CMD curl -f http://localhost:${APP_PORT}/health || exit 1

# Declare entrypoint
# You need to know where your app starts from
ENTRYPOINT ["node", "main.js"]