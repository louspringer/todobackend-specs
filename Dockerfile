FROM ubuntu:bionic
MAINTAINER Lou Springer <lou@louspringer.com>

# Prevent dpkg errors
ENV TERM=xterm-256color

# Set mirrors to NZ
# RUN sed -i "s/http:\/\/archive./http:\/\/nz.archive./g" /etc/apt/sources.list 

# Install node.js
RUN apt-get update && \
    apt-get install curl sudo gnupg -y && \
	curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash - && \
    apt-get install -y nodejs

COPY . /app
WORKDIR /app

# Install application dependencies
RUN npm install -g mocha && \
    npm install

# Set mocha test runner as entrypoint
ENTRYPOINT ["mocha"]
