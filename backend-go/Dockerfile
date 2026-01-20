FROM golang:1.25

WORKDIR /app

COPY app/go.mod app/go.sum ./


COPY ../hreg-client ../hreg-client

RUN go mod tidy
RUN go mod download


COPY app ./


RUN go build -o app .

EXPOSE 8080

# Run the compiled app
CMD ["./app"]
