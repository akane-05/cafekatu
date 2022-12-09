package controller

import (
	"log"
	"net/http"

	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/gin-gonic/gin"
)

// DIを用いたコントローラーの実装
// インターフェースで実装すべきメソッドを決める
type CommonController interface {
	GetPrefectures(c *gin.Context)
}

// 構造体の宣言
type commonController struct {
	dr repository.CommonRepository
}

// demoControllerのコンストラクタ
func NewCommonController(dr repository.CommonRepository) CommonController {
	return &commonController{dr}
}

func (dc *commonController) GetPrefectures(c *gin.Context) {

	// GetDemosメソッドにwhere句追加する
	prefectures, err := dc.dr.GetPrefectures()
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "ok",
		"data":    prefectures,
	})

}
