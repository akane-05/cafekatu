package main

import (
	"net/http"
	// "fmt"

	"github.com/akane-05/demo-app/back-app/controller"
	"github.com/akane-05/demo-app/back-app/model/repository"
)

//DIを行う
var dr = repository.NewDemoRepository()
var dc = controller.NewDemoController(dr)
var ro = controller.NewRouter(dc)

func main() {

	// //型定義と代入同時
	// server := http.Server{
	// 	Addr: ":8080",
	// }

	// http.HandleFunc("/cafe", ro.HandleTodosRequest)

	// //server(http.Server)のListenAndServeメソッドを使用
	// //サーバーを起動
	// server.ListenAndServe()

	//以下テスト
	mux := http.NewServeMux()
	//メソッドをセット
	mux.Handle("/cafes", http.HandlerFunc(ro.HandleTodosRequest))
	http.ListenAndServe(":8080", mux)

}
