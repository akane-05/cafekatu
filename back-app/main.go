package main

import (
    "net/http"
	"fmt"

	"github.com/akane-05/demo-app/back-app/controller"
	"github.com/akane-05/demo-app/back-app/model/repository"
)

var dr = repository.NewDemoRepository()
var dc = controller.NewDemoController(dr)
var ro = controller.NewRouter(dc)
s
func main() {

http.HandleFunc("/", handler)

    // 8080ポートで起動
    http.ListenAndServe(":8080", nil)
}

	// リクエストを処理する関数
func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello  Go.")
}