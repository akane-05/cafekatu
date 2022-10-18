package controller

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/gin-gonic/gin"
)

// DIを用いたコントローラーの実装
// インターフェースで実装すべきメソッドを決める
type CafesController interface {
	GetCafes(c *gin.Context)
	GetCafe(c *gin.Context)
	PostCafe(c *gin.Context)
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
func (dc *cafesController) GetCafes(c *gin.Context) {

	log.Println("GetCafes")

	// GetDemosメソッドにwhere句追加する
	cafes, err := dc.dr.GetCafes()
	if err != nil {
		fmt.Println(err)
		// c.JSON(http.StatusVariantAlsoNegotiates)
		return
	}

	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
		"data":    cafes,
	})

}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) GetCafe(c *gin.Context) {

	log.Println("GetCafe")

	// var id int
	// パスパラメータの取得、数字じゃなかったらどうするのか確認
	id, _ := strconv.Atoi(c.Param("id"))

	//検索結果をDTOに取得
	// GetDemosメソッドにwhere句追加する
	cafe, err := dc.dr.GetCafe(id)
	if err != nil {
		fmt.Println(err)
		return
	}

	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
		"data":    cafe,
	})

	log.Println("フロントに返却")

}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) PostCafe(c *gin.Context) {

	log.Println("PostCafe")

	cafe := entity.CafeEntity{}
	c.BindJSON(&cafe)
	if err := dc.dr.InsertCafe(cafe); err != nil {
		fmt.Println(err)
	}
	c.JSON(http.StatusOK, cafe)

	log.Println("登録完了　フロントに返却")

}
