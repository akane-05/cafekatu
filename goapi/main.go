package main

import (
	"log"
	"net/http"

	"github.com/akane-05/cafekatu/goapi/controller"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/gorilla/mux"
)

// DIを行う
var dr = repository.NewCafesRepository()
var dc = controller.NewCafesController(dr)

func main() {

	log.Println("main.go")
	r := mux.NewRouter()

	r.HandleFunc("/cafes", dc.GetCafes).Methods("GET")
	r.HandleFunc("/cafes", dc.PostCafe).Methods("POST")
	r.HandleFunc("/cafes/{id:[0-9]}", dc.GetCafe).Methods("GET")

	http.Handle("/", r)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}

}
