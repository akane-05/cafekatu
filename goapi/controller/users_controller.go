package controller

import (
	"log"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/akane-05/cafekatu/goapi/unit"
	"github.com/gin-gonic/gin"
)

// DIを用いたコントローラーの実装
// インターフェースで実装すべきメソッドを決める
type UsersController interface {
	GetUser(c *gin.Context)
	GetUserFavorites(c *gin.Context)
	GetUserPastPosts(c *gin.Context)
	PatchUser(c *gin.Context)
	DeleteUser(c *gin.Context)
}

// 構造体の宣言
type usersController struct {
	dr repository.UsersRepository
}

type PastPost struct {
	CafeInfo repository.CafeInfo `json:"cafeInfo"`
	Reviews  []entity.Reviews    `json:"reviews"`
}

type PastPostRes struct {
	PastPosts  []PastPost `json:"pastPosts"`
	CafesTotal int        `json:"cafes_total"`
	PagesTotal int        `json:"pages_total"`
}

// demoControllerのコンストラクタ
func NewUsersController(dr repository.UsersRepository) UsersController {
	return &usersController{dr}
}

func (dc *usersController) GetUser(c *gin.Context) {
	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": http.StatusUnauthorized,
			"error":  "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id != jwtInfo.Id {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "リクエストに不正な値が含まれています。",
		})
		return
	}

	user, err := dc.dr.GetUser(&jwtInfo.Id)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	user.PasswordDigest = ""

	log.Println("フロントに返却")

	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "ok",
		"data":    user,
	})

}

func (dc *usersController) PatchUser(c *gin.Context) {
	log.Println("PatchUser")

	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": http.StatusUnauthorized,
			"error":  "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	// パスパラメータの取得、数字じゃなかったらどうするのか確認
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id != jwtInfo.Id {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "リクエストに不正な値が含まれています。",
		})
		return
	}

	updateInfo := repository.UpdateInfo{}
	if err := c.BindJSON(&updateInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "リクエストに不正な値が含まれています。",
		})
		return
	}

	user, err := dc.dr.GetUser(&jwtInfo.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//パスワード確認
	if err = unit.CompareHashAndPassword(user.PasswordDigest, updateInfo.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "passwordが間違っています。",
		})
		return
	}

	//指定されなかった場合、従来の情報をセット
	if updateInfo.Nickname == "" {
		updateInfo.Nickname = user.Nickname
	}
	if updateInfo.Email == "" {
		updateInfo.Email = user.Email
	}

	newUserInfo, err := dc.dr.UpdateUser(&updateInfo, &jwtInfo.Id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//以下jwt認証

	newJwtInfo := unit.JwtInfo{Id: newUserInfo.Id, Email: newUserInfo.Email, ExTime: time.Now().Add(time.Hour)}

	tokenString := unit.CreateToken(&newJwtInfo)

	log.Println("更新完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"status":   http.StatusOK,
		"token":    tokenString,
		"id":       newUserInfo.Id,
		"email":    newUserInfo.Email,
		"nickname": newUserInfo.Nickname,
		"message":  "ユーザー情報を更新しました。",
	})

}

func (dc *usersController) GetUserFavorites(c *gin.Context) {
	log.Println("GetUserFavorites")

	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": http.StatusUnauthorized,
			"error":  "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id != jwtInfo.Id {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "リクエストに不正な値が含まれています。",
		})
		return
	}

	var query repository.UserQuery

	if err := c.BindQuery(&query); err != nil {
		log.Println("クエリパラメータに不正な値が含まれています。")
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "クエリパラメータに不正な値が含まれています。",
		})
		return
	}
	query.User_id = jwtInfo.Id

	cafes, err := dc.dr.GetUserFavorites(&query)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//件数
	cafesTotal, err := dc.dr.GetUserFavoTotal(&query)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//ページ数
	pageTotals := cafesTotal/int64(query.PerPage) + 1

	const baseNum = 10
	for i, cafe := range cafes {
		cafes[i].IsFavorite = true
		cafes[i].Rating = (math.Floor(cafe.Rating*baseNum) / baseNum)
	}

	cafesResponse := CafesResponse{cafes, int(cafesTotal), int(pageTotals)}
	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "ok",
		"data":    cafesResponse,
	})

}

func (dc *usersController) GetUserPastPosts(c *gin.Context) {
	log.Println("GetUserPastPosts")

	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": http.StatusUnauthorized,
			"error":  "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id != jwtInfo.Id {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "リクエストに不正な値が含まれています。",
		})
		return
	}

	var query repository.UserQuery

	if err := c.BindQuery(&query); err != nil {
		log.Println("クエリパラメータに不正な値が含まれています。")
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "クエリパラメータに不正な値が含まれています。",
		})
		return
	}

	query.User_id = jwtInfo.Id

	//レビューを投稿したことがあるカフェ情報を取得
	cafes, err := dc.dr.GetUserPastPosts(&query)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//一件もなかったら終了
	if len(cafes) == 0 {
		pastPostRes := PastPostRes{nil, 0, 0}
		c.JSON(http.StatusOK, gin.H{
			"status":  http.StatusOK,
			"message": "ok",
			"data":    pastPostRes,
		})
		return
	}

	//件数
	cafesTotal, err := dc.dr.GetUserPostCafesTotal(&query)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//ページ数
	pageTotals := cafesTotal/int64(query.PerPage) + 1

	//取得したカフェのお気に入り情報を取得
	favoCafesId, err := dc.dr.GetFavoirtes(&jwtInfo.Id)
	if err != nil {

		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	const baseNum = 10
	for i, cafe := range cafes {
		result := unit.Include(favoCafesId, cafe.Id)
		cafes[i].IsFavorite = result
		cafes[i].Rating = (math.Floor(cafe.Rating*baseNum) / baseNum)
	}

	//レビューを取得
	reviews, err := dc.dr.GetReviews(&jwtInfo.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//レビューをカフェごとに分ける
	var pastPosts []PastPost
	for _, cafe := range cafes {
		cafesReviews := unit.ExReviews(reviews, cafe.Id)
		pastPost := PastPost{cafe, cafesReviews}
		pastPosts = append(pastPosts, pastPost)
	}

	pastPostRes := PastPostRes{pastPosts, int(cafesTotal), int(pageTotals)}
	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"status":  http.StatusOK,
		"message": "ok",
		"data":    pastPostRes,
	})

}

func (dc *usersController) DeleteUser(c *gin.Context) {

	log.Println("DeleteUser")
	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": http.StatusUnauthorized,
			"error":  "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil || id != jwtInfo.Id {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "idが不正な値です。数値を入力してください。",
		})
		return
	}

	user := entity.Users{Id: jwtInfo.Id}
	if err := dc.dr.DeleteUser(&user); err != nil {
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
		"message": "ユーザーを削除しました。",
	})
}
