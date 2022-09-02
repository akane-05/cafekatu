package main

import (
    "net/http"
	"fmt"
)

func main() {

http.HandleFunc("/", handler)

    // 8080ポートで起動
    http.ListenAndServe(":8080", nil)
}

	// リクエストを処理する関数
func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello  Go.")
}