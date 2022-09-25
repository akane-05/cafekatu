package controller

import (
	"net/http"
)

// 外部パッケージに公開するインタフェース
type Router interface {
	HandleTodosRequest(w http.ResponseWriter, r *http.Request)
}

// 非公開のRouter構造体
type router struct {
	dc DemoController
}

// Routerのコンストラクタ。
//引数にTodoControllerを受け取り、Router構造体のポインタを返却する。
func NewRouter(dc DemoController) Router {
	return &router{dc}
}

//ポインタレシーバ(*router)にメソッドを追加
func (ro *router) HandleTodosRequest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "OPTIONS" {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case "GET":
		ro.dc.GetDemos(w, r)
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
