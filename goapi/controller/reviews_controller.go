package controller

import (
	"log"
	"net/http"
	"strconv"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/akane-05/cafekatu/goapi/unit"
	"github.com/gin-gonic/gin"
)

// DIを用いたコントローラーの実装
// インターフェースで実装すべきメソッドを決める
type ReviewsController interface {
	// GetUserReviews(c *gin.Context)
	GetCafesReviews(c *gin.Context)
	PostReview(c *gin.Context)
	DeleteReview(c *gin.Context)
}

// 構造体の宣言
type reviewsController struct {
	dr repository.ReviewsRepository
}

// demoControllerのコンストラクタ
func NewReviewsController(dr repository.ReviewsRepository) ReviewsController {
	return &reviewsController{dr}
}

type ReviewsResponse struct {
	Reviews      []repository.Review `json:"reviews"`
	ReviewsTotal int                 `json:"reviews_total"`
	PagesTotal   int                 `json:"pages_total"`
}

func (dc *reviewsController) GetCafesReviews(c *gin.Context) {

	log.Println("GetCafesReviews")

	// パスパラメータの取得、数字じゃなかったらどうするのか確認
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "idが不正な値です。数値を入力してください。",
		})
		return
	}

	var query repository.ReviewQuery
	if err := c.BindQuery(&query); err != nil {
		log.Println("クエリパラメータに不正な値が含まれています。")
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "クエリパラメータに不正な値が含まれています。",
		})
		return
	}

	var reviews []repository.Review

	reviews, err = dc.dr.GetCafesReviews(&id, &query)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//件数
	reviewsTotal, err := dc.dr.GetReviewsTotal(&id)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//ページ数
	pageTotals := reviewsTotal/int64(query.PerPage) + 1

	reviewsResponse := ReviewsResponse{reviews, int(reviewsTotal), int(pageTotals)}

	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "ok",
		"data":    reviewsResponse,
	})

}

func (dc *reviewsController) PostReview(c *gin.Context) {

	log.Println("PostReview")

	review := entity.Reviews{}
	if err := c.BindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "リクエストに不正な値が含まれています。",
		})
		return
	}

	//jwtから値取り出し
	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": http.StatusUnauthorized,
			"error":  "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	review.User_id = jwtInfo.Id

	if err := dc.dr.InsertReview(&review); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("登録完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "レビューを投稿しました。",
	})

}

func (dc *reviewsController) DeleteReview(c *gin.Context) {

	log.Println("DeleteReview")

	// パスパラメータの取得、数字じゃなかったらどうするのか確認
	var err error
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "idが不正な値です。数値を入力してください。",
		})
		return
	}

	review := entity.Reviews{Id: id}

	if err := dc.dr.DeleteReview(&review); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("削除完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "レビューを削除しました。",
	})
}
