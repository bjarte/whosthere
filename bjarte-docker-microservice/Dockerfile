FROM oven/bun:1

WORKDIR /app
# Copy package.json first
COPY ./package.json ./

# Run bun install to generate the lockfile
RUN bun install

# Copy the rest of the application
COPY ./ .
EXPOSE ${PORT}

CMD ["bun", "run", "start"] 
