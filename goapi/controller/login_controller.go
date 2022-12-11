package controller

import (
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/akane-05/cafekatu/goapi/unit"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// DIを用いたコントローラーの実装
// インターフェースで実装すべきメソッドを決める
type LoginController interface {
	Login(c *gin.Context)
	Register(c *gin.Context)
}

// 構造体の宣言
type loginController struct {
	dr repository.LoginRepository
}

// demoControllerのコンストラクタ
func NewLoginController(dr repository.LoginRepository) LoginController {
	return &loginController{dr}
}

type LoginInfo struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterInfo struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Nickname string `json:"nickname" binding:"required"`
}

func (dc *loginController) Login(c *gin.Context) {

	loginInfo := LoginInfo{}
	if err := c.BindJSON(&loginInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "リクエストに不正な値が含まれています。",
		})
		return
	}

	user, err := dc.dr.GetUser(&loginInfo.Email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			log.Printf("入力されたemail,またはpasswordが間違っています。%s", loginInfo.Email)
			c.JSON(http.StatusUnauthorized, gin.H{
				"status": http.StatusUnauthorized,
				"error":  "入力されたemail,またはpasswordが間違っています。",
			})
			return
		}
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	if err = unit.CompareHashAndPassword(user.PasswordDigest, loginInfo.Password); err != nil {
		log.Printf("入力されたemail,またはpasswordが間違っています。%s", loginInfo.Password)
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": http.StatusUnauthorized,
			"error":  "入力されたemail,またはpasswordが間違っています。",
		})
		return
	}

	//以下jwt認証
	jwtInfo := unit.JwtInfo{Id: user.Id, Email: user.Email, ExTime: time.Now().Add(time.Hour)}

	tokenString := unit.CreateToken(&jwtInfo)

	c.JSON(http.StatusOK, gin.H{
		"status":   http.StatusOK,
		"token":    tokenString,
		"id":       user.Id,
		"email":    user.Email,
		"nickname": user.Nickname,
		"message":  "ログインしました。",
	})

}

func (dc *loginController) Register(c *gin.Context) {
	log.Println("Register")

	registerInfo := RegisterInfo{}
	if err := c.BindJSON(&registerInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status": http.StatusBadRequest,
			"error":  "リクエストに不正な値が含まれています。",
		})
		return
	}

	//emailが登録済みのものか検証
	exist, err := dc.dr.CheckEmail(&registerInfo.Email)
	if exist {
		log.Printf("登録済みのemailアドレスが入力されました。%s", registerInfo.Email)
		c.JSON(http.StatusUnauthorized, gin.H{
			"status": http.StatusUnauthorized,
			"error":  "登録済みのemailアドレスです。別のアドレスで登録してください。",
		})
		return
	}

	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//user登録
	var postUser entity.Users
	postUser.Email = registerInfo.Email
	postUser.PasswordDigest, _ = unit.PasswordEncrypt(registerInfo.Password)
	postUser.Nickname = registerInfo.Nickname

	id, err := dc.dr.InsertUser(&postUser)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"status": http.StatusInternalServerError,
			"error":  "サーバーでエラーが発生しました。",
		})
		return
	}

	//以下jwt認証
	jwtInfo := unit.JwtInfo{Id: id, Email: postUser.Email, ExTime: time.Now().Add(time.Hour)}
	tokenString := unit.CreateToken(&jwtInfo)
	log.Println("tokenString:", tokenString)

	c.JSON(http.StatusOK, gin.H{
		"status":   http.StatusOK,
		"token":    tokenString,
		"id":       id,
		"email":    postUser.Email,
		"nickname": postUser.Nickname,
		"message":  "ユーザー登録が完了しました。",
	})
}
