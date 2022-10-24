package controller

import (
	"log"
	"net/http"
	"strconv"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/gin-gonic/gin"
)

// DIを用いたコントローラーの実装
// インターフェースで実装すべきメソッドを決める
type ReviewsController interface {
	GetReviews(c *gin.Context)
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

type ReviewQuery struct {
	PerPage int `form:"per_page" binding:"required"`
	Page    int `form:"page" binding:"required"`
	Cafe_id int `form:"cafe_id"`
	User_id int `form:"user_id"`
}

func (dc *reviewsController) GetReviews(c *gin.Context) {

	var query repository.ReviewQuery

	log.Println("GetReviews")
	if err := c.BindQuery(&query); err != nil {
		log.Println("クエリパラメータに不正な値が含まれています。")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "クエリパラメータに不正な値が含まれています。",
		})
		return
	}

	var reviews []entity.ReviewEntity
	var err error
	if query.User_id != 0 {
		reviews, err = dc.dr.GetUserReviews(&query)
	} else if query.Cafe_id != 0 {
		reviews, err = dc.dr.GetCafeReviews(&query)
	} else {
		log.Println("クエリパラメータの値が不足しています。")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "クエリパラメータの値が不足しています。",
		})
	}

	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
		"data":    reviews,
	})

	log.Println("フロントに返却")

}

func (dc *reviewsController) PostReview(c *gin.Context) {

	log.Println("PostReview")

	review := entity.ReviewEntity{}
	if err := c.BindJSON(&review); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "リクエストに不正な値が含まれています。",
		})
		return
	}

	//クッキーから値取り出し
	userId, err := c.Cookie("user")
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	review.User_id, _ = strconv.Atoi(userId)

	if err := dc.dr.InsertReview(&review); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("登録完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "レビューを投稿しました。",
	})

	return

}

func (dc *reviewsController) DeleteReview(c *gin.Context) {

	log.Println("DeleteReview")

	// パスパラメータの取得、数字じゃなかったらどうするのか確認
	var err error
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "idが不正な値です。数値を入力してください。",
		})
		return
	}

	var review entity.ReviewEntity
	review.Id = id

	if err := dc.dr.DeleteReview(&review); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("削除完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "お気に入りから削除しました。",
	})
}
