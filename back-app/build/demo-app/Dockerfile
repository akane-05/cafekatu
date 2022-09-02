FROM golang:1.18-alpine
# ENV ROOT=/go/src/app
# RUN mkdir ${ROOT}
# WORKDIR ${ROOT}

# COPY go.mod ./
# COPY . .
# RUN go get
# RUN CGO_ENABLED=0 GOOS=linux go build -o $ROOT/binary
# EXPOSE 8080
# CMD ["/go/src/app/binary"]

WORKDIR /build
# COPY ../../go.mod ../../go.sum ./
COPY ./go.mod ./
RUN go mod download
COPY ./  ./

ARG CGO_ENABLED=0
ARG GOOS=linux
ARG GOARCH=amd64
RUN go build -ldflags '-s -w' ./cmd/demo-app

FROM alpine
COPY --from=builder /build/demo-app /opt/app/
ENTRYPOINT ["/opt/app/demo-app"]