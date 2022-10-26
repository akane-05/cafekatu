package unit

import (
	"errors"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

type JwtInfo struct {
	Id    int
	Email string
}

// トークンを作成
func CreateToken(jwtInfo *JwtInfo) (tokenString string) {
	//以下jwt認証
	claims := jwt.MapClaims{
		"id":    jwtInfo.Id,
		"email": jwtInfo.Email,
		"exp":   time.Now().Add(time.Hour).Unix(),
	}

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

	jwtToken, err := extractBearerToken(c.GetHeader("Authorization"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	token, err := parseToken(jwtToken)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": errors.New("bad jwt token"),
		})
		return
	}

	_, OK := token.Claims.(jwt.MapClaims)
	if !OK {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": errors.New("unable to parse claims"),
		})
		return
	}

}

// Parse は jwt トークンから元になった認証情報を取り出す。
func GetJwtToken(c *gin.Context) (JwtInfo, error) {
	var jwtInfo JwtInfo

	jwtToken, _ := extractBearerToken(c.GetHeader("Authorization"))

	token, _ := parseToken(jwtToken)

	claims, _ := token.Claims.(jwt.MapClaims)

	email, OK := claims["email"].(string)
	if !OK {
		return jwtInfo, errors.New("トークンの取得に失敗しました。")
	}

	id, OK := claims["id"].(string)
	if !OK {
		return jwtInfo, errors.New("トークンの取得に失敗しました。")
	}

	idNum, _ := strconv.Atoi(c.Param(id))
	jwtInfo = JwtInfo{idNum, email}

	return jwtInfo, nil

}

func extractBearerToken(header string) (string, error) {
	if header == "" {
		return "", errors.New("bad header value given")
	}

	jwtToken := strings.Split(header, " ")
	if len(jwtToken) != 2 {
		return "", errors.New("incorrectly formatted authorization header")
	}

	return jwtToken[1], nil
}

func parseToken(jwtToken string) (*jwt.Token, error) {
	secret := os.Getenv("SECRET_KEY")

	token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
		if _, OK := token.Method.(*jwt.SigningMethodHMAC); !OK {
			return nil, errors.New("bad signed method received")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, errors.New("bad jwt token")
	}

	return token, nil
}
