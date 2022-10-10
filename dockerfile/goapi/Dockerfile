FROM golang:1.18-alpine3.15 as builder

ARG ROOT=/go/src/github.com/akane-05/cafekatu/goapi
WORKDIR ${ROOT}

COPY go.mod ./
COPY go.sum ./
COPY main.go ./
COPY controller/ ./controller/
COPY model/ ./model/
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go install -v \
    -ldflags="-w -s" \
    ${ROOT}

FROM alpine:3.15
COPY --from=builder /go/bin/goapi /goapi
RUN chmod a+x /goapi

EXPOSE 8080
CMD ["/goapi"]