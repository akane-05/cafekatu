package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/akane-05/cafekatu/goapi/controller/dto"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/gorilla/mux"
)

// DIを用いたコントローラーの実装
// インターフェースで実装すべきメソッドを決める
type CafesController interface {
	GetCafes(w http.ResponseWriter, r *http.Request)
	GetCafe(w http.ResponseWriter, r *http.Request)
}

// 構造体の宣言
type cafesController struct {
	dr repository.CafesRepository
}

// demoControllerのコンストラクタ
func NewCafesController(dr repository.CafesRepository) CafesController {
	return &cafesController{dr}
}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) GetCafes(w http.ResponseWriter, r *http.Request) {

	log.Println("GetCafes")

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "OPTIONS" {
		log.Println("OPTIONS")
		w.WriteHeader(http.StatusOK)
		return
	}

	// クエリパラメータ取得
	//query := r.URL.Query()

	//&バリデーションチェック ページとかのクエリー
	//keyがなかった場合エラーを返す、あとでメソッド追加
	// if len(key) == 0 {
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	w.Write(createRespqnsJson(&apiRequestResponse{Code: 2002, Message: "key paramater not found."}))
	// 	return
	// }

	// id, _ := strconv.Atoi(r.URL.Query().Get("id"))
	// if id != nil {
	// 	w.WriteHeader(500)
	// 	return
	// }

	// GetDemosメソッドにwhere句追加する
	searchResult, err := dc.dr.GetCafes()
	if err != nil {
		w.WriteHeader(500)
		return
	}

	// 検索結果をDTOに取得
	var cafes []dto.CafeResponse
	for _, v := range searchResult {
		cafes = append(cafes, v.ToDto())
	}

	var cafesResponse dto.CafesResponse
	cafesResponse.Cafes = cafes

	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	if err := enc.Encode(&cafesResponse); err != nil {
		log.Fatal(err)
	}
	fmt.Fprint(w, buf.String())

	log.Println("フロントに返却")

}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) GetCafe(w http.ResponseWriter, r *http.Request) {

	log.Println("GetCafe")

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	if r.Method == "OPTIONS" {
		log.Println("OPTIONS")
		w.WriteHeader(http.StatusOK)
		return
	}

	var id int
	// パスパラメータの取得
	vars := mux.Vars(r)
	id, _ = strconv.Atoi(vars["id"])

	//検索結果をDTOに取得
	// GetDemosメソッドにwhere句追加する
	searchResult, err := dc.dr.GetCafe(id)
	if err != nil {
		w.WriteHeader(500)
		return
	}

	// 検索結果をDTOに取得
	cafeInfo := searchResult.ToDto()

	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	if err := enc.Encode(&cafeInfo); err != nil {
		log.Fatal(err)
	}
	fmt.Fprint(w, buf.String())

	log.Println("フロントに返却")

}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) PostCafe(w http.ResponseWriter, r *http.Request) {

	// log.Println("PostCafe")

	// w.Header().Set("Content-Type", "application/json")
	// w.Header().Set("Access-Control-Allow-Origin", "*")
	// w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE")
	// w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

	// if r.Method == "OPTIONS" {
	// 	log.Println("OPTIONS")
	// 	w.WriteHeader(http.StatusOK)
	// 	return
	// }

	// var id int
	// // パスパラメータの取得
	// vars := mux.Vars(r)
	// id, _ = strconv.Atoi(vars["id"])

	// //検索結果をDTOに取得
	// // GetDemosメソッドにwhere句追加する
	// searchResult, err := dc.dr.PostCafe(id)
	// if err != nil {
	// 	w.WriteHeader(500)
	// 	return
	// }

	// // 検索結果をDTOに取得
	// cafeInfo := searchResult.ToDto()

	// var buf bytes.Buffer
	// enc := json.NewEncoder(&buf)
	// if err := enc.Encode(&cafeInfo); err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Fprint(w, buf.String())

	// log.Println("フロントに返却")

}
