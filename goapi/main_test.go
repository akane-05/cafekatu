package main

import (
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-playground/assert/v2"
)

// func TestCreateTaken(t *testing.T) (tokenString string) {
// 	claims := jwt.MapClaims{
// 		"id":    1,
// 		"email": "test@email.com",
// 		"exp":   time.Now().Add(time.Hour).Unix(),
// 	}

// 	// ヘッダーとペイロードの生成
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	log.Printf("Header: %#v\n", token.Header)
// 	log.Printf("Claims: %#v\n", token.Claims)

// 	// トークンに署名を付与
// 	secret := os.Getenv("SECRET_KEY")
// 	tokenString, _ = token.SignedString([]byte(secret))

// 	return
// }

func TestGetCafes(t *testing.T) {

	claims := jwt.MapClaims{
		"id":    1,
		"email": "test@email.com",
		"exp":   time.Now().Add(time.Hour).Unix(),
	}

	// ヘッダーとペイロードの生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	log.Printf("Header: %#v\n", token.Header)
	log.Printf("Claims: %#v\n", token.Claims)

	// トークンに署名を付与
	secret := os.Getenv("SECRET_KEY")
	tokenString, _ := token.SignedString([]byte(secret))

	r := GetRouter()

	//query := repository.CafeQuery{PerPage: 1, Page: 1}

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/cafes/?PerPage=5&Page=1", nil)
	req.Header.Add("Authorization", tokenString)
	r.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	//assert.Equal(t, "pong", w.Body.String())
}
