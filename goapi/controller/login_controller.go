package controller

import (
	"log"

	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/gin-gonic/gin"
)

// DIを用いたコントローラーの実装
// インターフェースで実装すべきメソッドを決める
type LoginController interface {
	Login(c *gin.Context)
}

// 構造体の宣言
type loginController struct {
	dr repository.LoginRepository
}

// demoControllerのコンストラクタ
func NewLoginController(dr repository.LoginRepository) LoginController {
	return &loginController{dr}
}

func (dc *loginController) Login(c *gin.Context) {

	//ログインしたidをセットする
	user := "id"
	c.SetCookie("user", user, 3600, "/", "localhost", true, true)

	log.Println("フロントに返却")

	return
}
