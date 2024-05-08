FROM golang:latest AS build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY ./*.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /updater github.com/Leinadium/wca-states/updater

# -------------------------------------
FROM alpine:latest AS release
RUN apk add --no-cache mysql-client

WORKDIR /
COPY --from=build /updater /updater
ENTRYPOINT ["/updater"]
