package controller

import (
	"log"
	"net/http"
)

// 外部パッケージに公開するインタフェース
type Router interface {
	HandleCafesRequest(w http.ResponseWriter, r *http.Request)
}

// 非公開のRouter構造体
type router struct {
	dc CafesController
}

// Routerのコンストラクタ。
//引数にTodoControllerを受け取り、Router構造体のポインタを返却する。
func NewCafesRouter(dc CafesController) Router {
	return &router{dc}
}

//ポインタレシーバ(*router)にメソッドを追加
func (ro *router) HandleCafesRequest(w http.ResponseWriter, r *http.Request) {
	log.Println("router")

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "OPTIONS" {
		log.Println("OPTIONS")
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case "GET":
		// クエリパラメータ取得
		query := r.URL.Query()
		if _, ok := query["id"]; ok {
			{
				ro.dc.GetCafe(w, r)
			}
		} else {
			ro.dc.GetCafes(w, r)
		}

	// case "POST":
	// 	ro.tc.PostTodo(w, r)
	// case "PUT":
	// 	ro.tc.PutTodo(w, r)
	// case "DELETE":
	// 	ro.tc.DeleteTodo(w, r)
	default:
		w.WriteHeader(405)
	}
}
