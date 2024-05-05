FROM rust:bookworm AS builder
RUN USER=root cargo new --bin server
WORKDIR /server
COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock
RUN cargo build --release
RUN rm src/*.rs
COPY src src
RUN rm ./target/release/deps/server*
RUN cargo build --release

# building final image
FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y libssl3 && apt clean && rm -rf /var/lib/apt/lists/*

COPY --from=builder /server/target/release/server .
# running server
EXPOSE ${SERVER_PORT}
CMD ["./server"]