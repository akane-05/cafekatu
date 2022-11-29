package controller

import (
	"log"
	"math"
	"net/http"
	"strconv"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/akane-05/cafekatu/goapi/unit"
	"github.com/gin-gonic/gin"
)

// DIを用いたコントローラーの実装
// インターフェースで実装すべきメソッドを決める
type CafesController interface {
	GetCafes(c *gin.Context)
	GetCafe(c *gin.Context)
	PostCafe(c *gin.Context)
	PostFavorite(c *gin.Context)
	DeleteFavorite(c *gin.Context)
}

// 構造体の宣言
type cafesController struct {
	dr repository.CafesRepository
}

type CafesResponse struct {
	Cafes      []repository.CafeInfo `json:"cafes"`
	CafesTotal int                   `json:"cafes_total"`
	PagesTotal int                   `json:"pages_total"`
}

type CafeInfo struct {
	Cafe    repository.CafeInfo `json:"cafe"`
	Reviews []entity.Reviews    `json:"reviews"`
}

// demoControllerのコンストラクタ
func NewCafesController(dr repository.CafesRepository) CafesController {
	return &cafesController{dr}
}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) GetCafes(c *gin.Context) {

	//jwtから値取り出し
	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	var query repository.CafeQuery

	log.Println("GetCafes")
	if err := c.BindQuery(&query); err != nil {
		log.Println("クエリパラメータに不正な値が含まれています。")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "クエリパラメータに不正な値が含まれています。",
		})
		return
	}

	cafes, err := dc.dr.GetCafes(&query)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	//件数
	cafesTotal, err := dc.dr.GetCafesTotal(&query)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	//ページ数
	pageTotals := cafesTotal/int64(query.PerPage) + 1

	favoCafes, err := dc.dr.GetFavoirtes(&jwtInfo.Id, &cafes)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	const baseNum = 10
	for i, cafe := range cafes {
		result := unit.Include(favoCafes, cafe.Id)
		cafes[i].IsFavorite = result
		cafes[i].Rating = (math.Floor(cafe.Rating*baseNum) / baseNum)
	}

	cafesResponse := CafesResponse{cafes, int(cafesTotal), int(pageTotals)}
	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
		"data":    cafesResponse,
	})

}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) GetCafe(c *gin.Context) {

	log.Println("GetCafe")

	//jwtから値取り出し
	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	// パスパラメータの取得、数字じゃなかったらどうするのか確認
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "idが不正な値です。数値を入力してください。",
		})
		return
	}

	var query repository.CafeQuery

	log.Println("GetCafe")
	if err := c.BindQuery(&query); err != nil {
		log.Println("クエリパラメータに不正な値が含まれています。")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "クエリパラメータに不正な値が含まれています。",
		})
		return
	}

	cafe, err := dc.dr.GetCafe(&id)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			// "error": "サーバーでエラーが発生しました。 " + err.Error()
			"error": err.Error(),
		})
		return
	}

	const baseNum = 10
	cafe.Rating = (math.Floor(cafe.Rating*baseNum) / baseNum)

	favorite, err := dc.dr.GetFavoirte(&jwtInfo.Id, &id)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			// "error": "サーバーでエラーが発生しました。 " + err.Error()
			"error": err.Error(),
		})
		return
	}
	cafe.IsFavorite = favorite

	reviews, err := dc.dr.GetCafeReviews(&id, &query)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			// "error": "サーバーでエラーが発生しました。 " + err.Error()
			"error": err.Error(),
		})
		return
	}

	cafeInfo := CafeInfo{cafe, reviews}

	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
		"data":    cafeInfo,
	})

	log.Println("フロントに返却")

}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) PostCafe(c *gin.Context) {

	log.Println("PostCafe")

	cafe := entity.Cafes{}
	if err := c.BindJSON(&cafe); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "リクエストに不正な値が含まれています。",
		})
		return
	}

	if err := dc.dr.InsertCafe(&cafe); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("登録完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "登録処理が完了しました。管理人が確認するまでお待ちください。",
	})

}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) PostFavorite(c *gin.Context) {

	log.Println("PostFavorite")

	cafeId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "idが不正な値です。数値を入力してください。",
		})
		return
	}

	//jwtから値取り出し
	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}
	favo := entity.Favorites{User_id: jwtInfo.Id, Cafe_id: cafeId}

	if err := dc.dr.InsertFavorite(&favo); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("登録完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "お気に入りに登録しました。",
	})

}

// ポインタレシーバ(*demoController)にメソッドを追加
func (dc *cafesController) DeleteFavorite(c *gin.Context) {

	log.Println("DeleteFavorite")

	cafeId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "idが不正な値です。数値を入力してください。",
		})
		return
	}

	//jwtから値取り出し
	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	favo := entity.Favorites{User_id: jwtInfo.Id, Cafe_id: cafeId}

	if err := dc.dr.DeleteFavorite(&favo); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("登録完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "お気に入りから削除しました。",
	})

}
