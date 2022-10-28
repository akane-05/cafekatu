package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/akane-05/cafekatu/goapi/unit"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-playground/assert/v2"
)

func CreateTestTaken() (tokenString string) {
	var testTIme = time.Date(2022, 11, 1, 9, 0, 0, 0, time.Local)
	var jwtInfo = unit.JwtInfo{Id: 1, Email: "test@cafe.co.jp", ExTime: testTIme}

	claims := jwt.MapClaims{
		"id":    jwtInfo.Id,
		"email": jwtInfo.Email,
		"exp":   jwtInfo.ExTime.Unix(),
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

type cafesResponse struct {
	Message string
	Data    []repository.CafeInfo
}

type cafeResponse struct {
	Message string
	Data    repository.CafeInfo
}

type response struct {
	Message string
}

// テストをしたい入力値と期待値の一覧を作成
var cafesInfo = []repository.CafeInfo{
	repository.CafeInfo{1, "お菓子の家", "0600042", 1, "北海道", "札幌市", "大通１", "11時から15時まで", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3},
	repository.CafeInfo{2, "coffee shop", "0300846", 2, "青森県", "青森市", "青葉", "8時から12時まで", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 5},
	repository.CafeInfo{3, "喫茶東京", "1040044", 13, "東京都", "中央区", "明石町", "毎週土曜日定休日", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 5},
	repository.CafeInfo{4, "海の家", "9000002", 47, "沖縄県", "那覇市", "曙", "13時から", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3.5},
	repository.CafeInfo{5, "morning", "4520813", 38, "愛知県", "名古屋市", "西区", "年中無休", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 5},
}

func TestGetCafes(t *testing.T) {
	tokenString := CreateTestTaken()

	r := GetRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/cafes/?PerPage=5&Page=1", nil)
	req.Header.Add("Authorization", tokenString)
	r.ServeHTTP(w, req)

	var cafesResponse cafesResponse
	json.Unmarshal([]byte(w.Body.String()), &cafesResponse)

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, cafesResponse.Message, "ok")

	// 入力値と期待値を1件ずつテストする.
	for i, exInfo := range cafesInfo {
		var cafeInfo = cafesResponse.Data[i]
		assert.Equal(t, cafeInfo.Id, exInfo.Id)
		assert.Equal(t, cafeInfo.Zipcode, exInfo.Zipcode)
		assert.Equal(t, cafeInfo.PrefectureId, exInfo.PrefectureId)
		assert.Equal(t, cafeInfo.Prefecture, exInfo.Prefecture)
		assert.Equal(t, cafeInfo.City, exInfo.City)
		assert.Equal(t, cafeInfo.Street, exInfo.Street)
		assert.Equal(t, cafeInfo.BusinessHours, exInfo.BusinessHours)
		assert.Equal(t, cafeInfo.CreatedAt, exInfo.CreatedAt)
		assert.Equal(t, cafeInfo.UpdatedAt, exInfo.UpdatedAt)
		assert.Equal(t, cafeInfo.Rating, exInfo.Rating)
	}
}

func TestGetCafe(t *testing.T) {
	tokenString := CreateTestTaken()

	r := GetRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/cafe/1", nil)
	req.Header.Add("Authorization", tokenString)
	r.ServeHTTP(w, req)

	var cafeResponse cafeResponse
	json.Unmarshal([]byte(w.Body.String()), &cafeResponse)

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, cafeResponse.Message, "ok")

	// 入力値と期待値を1件ずつテストする.
	var exInfo = cafesInfo[0]
	var cafeInfo = cafeResponse.Data
	assert.Equal(t, cafeInfo.Id, exInfo.Id)
	assert.Equal(t, cafeInfo.Zipcode, exInfo.Zipcode)
	assert.Equal(t, cafeInfo.PrefectureId, exInfo.PrefectureId)
	assert.Equal(t, cafeInfo.Prefecture, exInfo.Prefecture)
	assert.Equal(t, cafeInfo.City, exInfo.City)
	assert.Equal(t, cafeInfo.Street, exInfo.Street)
	assert.Equal(t, cafeInfo.BusinessHours, exInfo.BusinessHours)
	assert.Equal(t, cafeInfo.CreatedAt, exInfo.CreatedAt)
	assert.Equal(t, cafeInfo.UpdatedAt, exInfo.UpdatedAt)
	assert.Equal(t, cafeInfo.Rating, exInfo.Rating)
}

func TestPostCafe(t *testing.T) {
	tokenString := CreateTestTaken()
	r := GetRouter()
	w := httptest.NewRecorder()
	cafe := entity.CafeEntity{
		Name:          "testCafe",
		Zipcode:       "1111111",
		PrefectureId:  1,
		City:          "testCity",
		Street:        "testStreet",
		BusinessHours: "営業時間",
	}
	jsonValue, _ := json.Marshal(cafe)
	req, _ := http.NewRequest("POST", "/cafes", bytes.NewBuffer(jsonValue))
	req.Header.Add("Authorization", tokenString)

	r.ServeHTTP(w, req)

	var response response
	json.Unmarshal([]byte(w.Body.String()), &response)

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "登録処理が完了しました。管理人が確認するまでお待ちください。")

}

func TestPostFavorite(t *testing.T) {
	tokenString := CreateTestTaken()
	r := GetRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/cafes/1/favorite", nil)
	req.Header.Add("Authorization", tokenString)

	r.ServeHTTP(w, req)

	var response response
	json.Unmarshal([]byte(w.Body.String()), &response)

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "お気に入りに登録しました。")

}

func TestDeleteFavorite(t *testing.T) {
	tokenString := CreateTestTaken()
	r := GetRouter()
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/cafes/1/favorite", nil)
	req.Header.Add("Authorization", tokenString)

	r.ServeHTTP(w, req)

	var response response
	json.Unmarshal([]byte(w.Body.String()), &response)

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "お気に入りから削除しました。")

}
