package main

import (
	"log"
	"net/http"

	"github.com/akane-05/demo-app/back-app/controller"
	"github.com/akane-05/demo-app/back-app/model/repository"
)

//DIを行う
var dr = repository.NewCafesRepository()
var dc = controller.NewCafesController(dr)
var ro = controller.NewCafesRouter(dc)

func main() {

	log.Println("main.go")
	mux := http.NewServeMux()

	// URLに対応する処理を登録
	// mux.HandleFunc("/test", test)
	mux.HandleFunc("/cafes", ro.HandleCafesRequest)

	server := http.Server{
		Addr: ":8080",
		// 作成したマルチプレクサを指定
		Handler: mux,
	}
	server.ListenAndServe()

}
