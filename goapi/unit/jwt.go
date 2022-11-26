package unit

import (
	"errors"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type JwtInfo struct {
	Id     int
	Email  string
	ExTime time.Time
}

// トークンを作成
func CreateToken(jwtInfo *JwtInfo) (tokenString string) {
	//以下jwt認証
	claims := jwt.MapClaims{
		"id":    jwtInfo.Id,
		"email": jwtInfo.Email,
		"exp":   jwtInfo.ExTime.Unix(),
	}
	log.Printf("claims: %#v\n", claims)

	// ヘッダーとペイロードの生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	log.Printf("Header: %#v\n", token.Header)
	log.Printf("Claims: %#v\n", token.Claims)

	// トークンに署名を付与
	secret := os.Getenv("SECRET_KEY")
	tokenString, _ = token.SignedString([]byte(secret))

	return
}

// Parse は jwt トークンから元になった認証情報を取り出す。
func CheckJwtToken(c *gin.Context) {
	log.Println("ミドルウェア トークン確認開始")

	jwtToken, err := ExtractBearerToken(c.GetHeader("Authorization"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}
	log.Println("ミドルウェア ヘッダーにトークンが設定されていることを確認")

	token, err := ParseToken(jwtToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}
	log.Println("ミドルウェア トークンを取得")

	_, OK := token.Claims.(jwt.MapClaims)
	if !OK {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "ログイン情報を取得できませんでした。再度ログインしてください。",
		})
		return
	}
	log.Println("ミドルウェア トークンの情報を取得が完了")

}

// Parse は jwt トークンから元になった認証情報を取り出す。
func GetJwtToken(c *gin.Context) (JwtInfo, error) {
	var jwtInfo JwtInfo

	jwtToken, _ := ExtractBearerToken(c.GetHeader("Authorization"))

	token, _ := ParseToken(jwtToken)

	claims, _ := token.Claims.(jwt.MapClaims)

	email, OK := claims["email"].(string)
	if !OK {
		return jwtInfo, errors.New("トークンの取得に失敗しました。 email")
	}

	idF, OK := claims["id"].(float64)
	log.Println(idF)
	if !OK {
		return jwtInfo, errors.New("トークンの取得に失敗しました。 id")
	}

	id := int(idF)
	jwtInfo = JwtInfo{Id: id, Email: email}

	return jwtInfo, nil

}

func ExtractBearerToken(header string) (string, error) {
	if header == "" {
		log.Println("bad header value given")
		return "", errors.New("bad header value given")
	}

	jwtToken := strings.Split(header, " ")
	if len(jwtToken) != 2 {
		log.Println("incorrectly formatted authorization header")
		return "", errors.New("incorrectly formatted authorization header")
	}

	return jwtToken[1], nil
}

func ParseToken(jwtToken string) (*jwt.Token, error) {

	secret := os.Getenv("SECRET_KEY")

	// jwtの検証
	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil // CreateTokenにて指定した文字列を使います
	})
	if err != nil {
		return token, err
	}

	return token, nil
}
