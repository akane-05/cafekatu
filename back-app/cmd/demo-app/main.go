package main

import (
	"fmt"
	"log"
	"net/http"

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

	//server(http.Server)のListenAndServeメソッドを使用
	//サーバーを起動
	// server.ListenAndServe()

	//以下テスト
	// http.HandleFunc("/cafe", ro.HandleTodosRequest)
	// http.ListenAndServe(":8080", nil)
	// // http.HandleFunc("/users", returnAllArticles)

	log.Println("はじめ")

	// http.HandleFunc("/test", test)
	// http.HandleFunc("/cafes", ro.HandleTodosRequest)
	// http.ListenAndServe(":8080", nil)

	mux := http.NewServeMux()

	// URLに対応する処理を登録
	mux.HandleFunc("/test", test)
	mux.HandleFunc("/cafes", ro.HandleTodosRequest)

	server := http.Server{
		Addr: ":8080",
		// 作成したマルチプレクサを指定
		Handler: mux,
	}
	server.ListenAndServe()

}

func test(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.WriteHeader(http.StatusOK)
	log.Println("test")
	fmt.Fprintf(w, "こんにちは")
}
