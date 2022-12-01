package controller

import (
	"log"
	"math"
	"net/http"

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
	PatchUser(c *gin.Context)
	DeleteUser(c *gin.Context)
}

// 構造体の宣言
type usersController struct {
	dr repository.UsersRepository
}

type UserInfo struct {
	User    entity.Users     `json:"user"`
	Reviews []entity.Reviews `json:"reviews"`
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
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	var query repository.UserQuery

	if err := c.BindQuery(&query); err != nil {
		log.Println("クエリパラメータに不正な値が含まれています。")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "クエリパラメータに不正な値が含まれています。",
		})
		return
	}

	user, err := dc.dr.GetUser(&jwtInfo.Id)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	reviews, err := dc.dr.GetUserReviews(&jwtInfo.Id, &query)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	userInfo := UserInfo{user, reviews}

	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
		"data":    userInfo,
	})

	log.Println("フロントに返却")

}

func (dc *usersController) PatchUser(c *gin.Context) {
	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	patchUserInfo := repository.PatchUserInfo{}
	if err := c.BindJSON(&patchUserInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "リクエストに不正な値が含まれています。",
		})
		return
	}
	patchUserInfo.Id = jwtInfo.Id

	// if err := dc.dr.UpdateUser(&patchUserInfo); err != nil {
	// 	log.Println(err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"error": "サーバーでエラーが発生しました。",
	// 	})
	// 	return
	// }

	log.Println("更新完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "ユーザー情報を更新しました。",
	})

}

func (dc *usersController) GetUserFavorites(c *gin.Context) {
	log.Println("GetUserFavorites")

	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	var query repository.UserQuery

	if err := c.BindQuery(&query); err != nil {
		log.Println("クエリパラメータに不正な値が含まれています。")
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "クエリパラメータに不正な値が含まれています。",
		})
		return
	}
	query.User_id = jwtInfo.Id

	cafes, err := dc.dr.GetUserFavorites(&query)
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

	// favoCafes, err := dc.dr.GetFavoirtes(&jwtInfo.Id, &cafes)
	// if err != nil {
	// 	log.Println(err.Error())
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"error": "サーバーでエラーが発生しました。",
	// 	})
	// 	return
	// }

	const baseNum = 10
	for i, cafe := range cafes {
		cafes[i].IsFavorite = true
		cafes[i].Rating = (math.Floor(cafe.Rating*baseNum) / baseNum)
	}

	cafesResponse := CafesResponse{cafes, int(cafesTotal), int(pageTotals)}
	log.Println("フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "ok",
		"data":    cafesResponse,
	})

}

func (dc *usersController) DeleteUser(c *gin.Context) {

	log.Println("DeleteUser")
	jwtInfo, err := unit.GetJwtToken(c)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	user := entity.Users{Id: jwtInfo.Id}
	if err := dc.dr.DeleteUser(&user); err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "サーバーでエラーが発生しました。",
		})
		return
	}

	log.Println("削除完了　フロントに返却")
	c.JSON(http.StatusOK, gin.H{
		"message": "ユーザーを削除しました。",
	})
}
