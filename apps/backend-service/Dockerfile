FROM rust:1.75

COPY ./  ./

# Build program for release
RUN cargo build --release

CMD ["./target/release/backend-service"]

