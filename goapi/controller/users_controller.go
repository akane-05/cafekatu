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
type UsersController interface {
	GetUser(c *gin.Context)
	PostUser(c *gin.Context)
	PatchUser(c *gin.Context)
	DeleteUser(c *gin.Context)
}

// 構造体の宣言
type usersController struct {
	dr repository.UsersRepository
}

// demoControllerのコンストラクタ
func NewUsersController(dr repository.UsersRepository) UsersController {
	return &usersController{dr}
}

func (dc *usersController) GetUser(c *gin.Context) {
	userId, err := c.Cookie("user")
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	id, err := strconv.Atoi(c.Param(userId))

	// GetDemosメソッドにwhere句追加する
	user, err := dc.dr.GetUser(&id)
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
		"data":    user,
	})

	log.Println("フロントに返却")

}
func (dc *usersController) PostUser(c *gin.Context) {

	log.Println("PostUser")

	// user := entity.UserEntity{}
	// if err := c.BindJSON(&user); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"error": "リクエストに不正な値が含まれています。",
	// 	})
	// 	return
	// }

	// if err := dc.dr.InsertUser(&user); err != nil {
	// 	log.Println(err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"error": "サーバーでエラーが発生しました。",
	// 	})
	// 	return
	// }

	// log.Println("登録完了　フロントに返却")
	// c.JSON(http.StatusOK, gin.H{
	// 	"message": "ユーザー登録が完了しました。",
	// })

	//登録したidをセットする
	user := "id"
	c.SetCookie("user", user, 3600, "/", "localhost", true, true)

	return

}

func (dc *usersController) PatchUser(c *gin.Context) {
	// user := entity.UserEntity{}
	// if err := c.BindJSON(&user); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"error": "リクエストに不正な値が含まれています。",
	// 	})
	// 	return
	// }

	// userId, err := c.Cookie("user")
	// if err != nil {
	// 	log.Println(err)
	// 	c.JSON(http.StatusUnauthorized, gin.H{
	// 		"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
	// 	})
	// 	return
	// }

	// user.Id, _ = strconv.Atoi(c.Param(userId))
	// if err := dc.dr.UpdateUser(&user); err != nil {
	// 	log.Println(err)
	// 	c.JSON(http.StatusInternalServerError, gin.H{
	// 		"error": "サーバーでエラーが発生しました。",
	// 	})
	// 	return
	// }

	// log.Println("更新完了　フロントに返却")
	// c.JSON(http.StatusOK, gin.H{
	// 	"message": "ユーザー情報を更新しました。",
	// })

}

func (dc *usersController) DeleteUser(c *gin.Context) {

	log.Println("DeleteUser")
	//クッキーから値取り出し
	userId, err := c.Cookie("user")
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}

	var user entity.UserEntity
	user.Id, _ = strconv.Atoi(userId)

	if err := dc.dr.DeleteUser(&user); err != nil {
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
