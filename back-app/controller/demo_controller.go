package controller

import (
	"encoding/json"
	"net/http"

	// "path"
	// "strconv"

	"github.com/akane-05/demo-app/back-app/controller/dto"
	// "github.com/akane-05/demo-app/back-app/model/entity"
	"github.com/akane-05/demo-app/back-app/model/repository"
)

//DIを用いたコントローラーの実装
//インターフェースで実装すべきメソッドを決める
type DemoController interface {
	GetDemos(w http.ResponseWriter, r *http.Request)
}

//構造体の宣言
type demoController struct {
	dr repository.DemoRepository
}

//demoControllerのコンストラクタ
func NewDemoController(dr repository.DemoRepository) DemoController {
	return &demoController{dr}
}

//ポインタレシーバ(*demoController)にメソッドを追加
func (dc *demoController) GetDemos(w http.ResponseWriter, r *http.Request) {
	demos, err := dc.dr.GetDemos()
	if err != nil {
		w.WriteHeader(500)
		return
	}

	//検索結果を取得
	var demoResponses []dto.DemoResponse
	for _, v := range demos {
		demoResponses = append(demoResponses, dto.DemoResponse{Id: v.Id, Name: v.Name, PrefectureId: v.PrefectureId})
	}

	var demosResponse dto.DemosResponse
	demosResponse.Demos = demoResponses

	output, _ := json.MarshalIndent(demosResponse.Demos, "", "\t\t")

	//画面に出力
	w.Header().Set("Content-Type", "application/json")
	w.Write(output)

}
