FROM golang:1.18-alpine as builder

ENV ROOT=/cafekatu/goapi
RUN mkdir -p ${ROOT}
WORKDIR ${ROOT}

COPY goapi/go.mod ./
COPY goapi/go.sum ./

RUN go mod download

COPY goapi/main.go ./
COPY goapi/controller ./
COPY goapi/model ./

RUN go get

RUN CGO_ENABLED=0 GOOS=linux go build -o $ROOT/binary
EXPOSE 8080
CMD ["/cafeKatu/goapi/binary"]