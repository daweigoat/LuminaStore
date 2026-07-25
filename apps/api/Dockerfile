FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY apps/api/go.mod apps/api/go.sum* ./apps/api/
RUN cd apps/api && go mod download
COPY apps/api/ ./apps/api/
RUN cd apps/api && go build -o main cmd/api/main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/apps/api/main .
EXPOSE 8080
CMD ["./main"]
