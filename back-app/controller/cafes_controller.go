package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/akane-05/demo-app/back-app/controller/dto"
	"github.com/akane-05/demo-app/back-app/model/entity"
	"github.com/akane-05/demo-app/back-app/model/repository"
)

//DIを用いたコントローラーの実装
//インターフェースで実装すべきメソッドを決める
type CafesController interface {
	GetCafes(w http.ResponseWriter, r *http.Request)
	GetCafe(w http.ResponseWriter, r *http.Request)
}

//構造体の宣言
type cafesController struct {
	dr repository.CafesRepository
}

//demoControllerのコンストラクタ
func NewCafesController(dr repository.CafesRepository) CafesController {
	return &cafesController{dr}
}

//ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) GetCafes(w http.ResponseWriter, r *http.Request) {

	log.Println("GetCafes")

	// // クエリパラメータ取得
	// query := r.URL.Query()

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

	//DBに接続できないので一旦コメントアウト、手書きでデータ入寮
	//GetDemosメソッドにwhere句追加する
	// demos, err := dc.dr.GetCefes()
	// if err != nil {
	// 	w.WriteHeader(500)
	// 	return
	// }

	cafesSearchResult := []entity.CafeInfo{
		{1, "お菓子の家", 1, "中央区", "銀座", "11時から15時まで", "2022-09-26", "2022-09-26", 3},
		{2, "coffee shop", 1, "新宿区", "歌舞伎町", "8時から12時まで", "2022-09-26", "2022-09-26", 3},
	}

	log.Println("データ作成")
	log.Println(cafesSearchResult[0].Id)

	//検索結果をDTOに取得
	var cafes []dto.CafeResponse
	for _, v := range cafesSearchResult {
		cafes = append(cafes, dto.CafeResponse{Id: v.Id, Name: v.Name, PrefectureId: v.PrefectureId, City: v.City, Street: v.Street, Business_hours: v.BusinessHours, CreatedAt: v.CreatedAt, UpdatedAt: v.UpdatedAt, Rating: v.Rating})
	}

	var cafesResponse dto.CafesResponse
	cafesResponse.Cafes = cafes

	log.Println(cafesResponse.Cafes[0].Id)

	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	if err := enc.Encode(&cafesResponse); err != nil {
		log.Fatal(err)
	}
	fmt.Fprint(w, buf.String())

	log.Println("フロントに返却")

}

//ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) GetCafe(w http.ResponseWriter, r *http.Request) {

	log.Println("GetCafe")

	//DBに接続できないので一旦コメントアウト、手書きでデータ入寮
	//GetDemosメソッドにwhere句追加する
	// demos, err := dc.dr.GetCefes()
	// if err != nil {
	// 	w.WriteHeader(500)
	// 	return
	// }

	cafe := entity.CafeInfo{1, "お菓子の家", 1, "中央区", "銀座", "11時から15時まで", "2022-09-26", "2022-09-26", 3}

	log.Println("データ作成")

	//検索結果をDTOに取得
	cafeResponse := dto.CafeResponse{Id: cafe.Id, Name: cafe.Name, PrefectureId: cafe.PrefectureId, City: cafe.City, Street: cafe.Street, Business_hours: cafe.BusinessHours, CreatedAt: cafe.CreatedAt, UpdatedAt: cafe.UpdatedAt, Rating: cafe.Rating}

	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	if err := enc.Encode(&cafeResponse); err != nil {
		log.Fatal(err)
	}
	fmt.Fprint(w, buf.String())

	log.Println("フロントに返却")

}
