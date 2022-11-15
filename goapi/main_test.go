package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/akane-05/cafekatu/goapi/controller"
	"github.com/akane-05/cafekatu/goapi/model/entity"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/akane-05/cafekatu/goapi/unit"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-playground/assert/v2"
)

func createTestTaken() (tokenString string) {
	// var testTIme = time.Date(2022, 11, 1, 9, 0, 0, 0, time.Local)
	var testTIme = time.Now()
	var jwtInfo = unit.JwtInfo{Id: 1, Email: "user1@email.com", ExTime: testTIme}

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

	log.Printf("tokenString: %#v\n", tokenString)

	tokenString = "Bearer " + tokenString
	return
}

func checkTestJwtToken(tokenString string) (email string, id int, err error) {
	jwtToken, err := unit.ExtractBearerToken(tokenString)
	if err != nil {
		log.Fatal(err)
	}
	token, err := unit.ParseToken(jwtToken)
	if err != nil {
		return "", 0, err
	}

	claims, _ := token.Claims.(jwt.MapClaims)
	email, OK := claims["email"].(string)
	if !OK {
		return "", 0, errors.New("emailを取得できませんでした")
	}
	idF, OK := claims["id"].(float64)
	if !OK {
		return "", 0, errors.New("idを取得できませんでした")
	}
	id = int(idF)

	return email, id, nil
}

type response struct {
	Err     string `json:"error"`
	Message string `json:"message"`
	Token   string `json:"token"`
}

type loginResponse struct {
	response
	Token string `json:"token"`
}

// テストをしたい入力値と期待値の一覧を作成
var cafesInfo = []repository.CafeInfo{
	repository.CafeInfo{1, "お菓子の家", "0600042", 1, "北海道", "札幌市", "大通１", "11時から15時まで", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3},
	repository.CafeInfo{2, "coffee shop", "0300846", 2, "青森県", "青森市", "青葉", "8時から12時まで", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3},
	repository.CafeInfo{3, "喫茶東京", "1040044", 13, "東京都", "中央区", "明石町", "毎週土曜日定休日", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 5},
}

func request(method string, url string, body io.Reader) (w *httptest.ResponseRecorder) {
	tokenString := createTestTaken()

	r := GetRouter()
	w = httptest.NewRecorder()
	req, _ := http.NewRequest(method, url, body)

	if url != "/register" && url != "/login" {
		req.Header.Add("Authorization", tokenString)
	}

	r.ServeHTTP(w, req)

	return

}

func TestRegister(t *testing.T) {
	registerInfo := controller.RegisterInfo{
		Email:    "register@email.com",
		Password: "password",
		Nickname: "登録ニックネーム",
	}
	jsonValue, _ := json.Marshal(registerInfo)

	w := request("POST", "/register", bytes.NewBuffer(jsonValue))
	t.Log(w.Body.String())

	t.Log(bytes.NewBuffer(jsonValue))

	var response loginResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err.Error())
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.response.Message, "ユーザー登録が完了しました。")

	//jwt
	email, id, err := checkTestJwtToken(response.Token)
	if err != nil {
		log.Fatal(err.Error())
	}
	assert.Equal(t, email, "register@email.com")
	assert.Equal(t, id, 4)

}

func TestLogin(t *testing.T) {
	loginInfo := controller.LoginInfo{
		Email:    "login@email.com",
		Password: "password",
	}
	jsonValue, _ := json.Marshal(loginInfo)
	w := request("POST", "/login", bytes.NewBuffer(jsonValue))
	t.Log(w.Body.String())

	var response loginResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err.Error())
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.response.Message, "ログインしました。")

	//jwt
	email, id, err := checkTestJwtToken(response.Token)
	if err != nil {
		log.Fatal(err.Error())
	}
	assert.Equal(t, email, "login@email.com")
	assert.Equal(t, id, 1)

}

func TestGetCafes(t *testing.T) {

	w := request("GET", "/cafes?per_page=5&page=1", nil)
	t.Log(w.Body.String())

	type cafesResponse struct {
		response
		Data []repository.CafeInfo `json:"data"`
	}
	var reponse cafesResponse

	if err := json.Unmarshal(w.Body.Bytes(), &reponse); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, reponse.response.Message, "ok")

	// 入力値と期待値を1件ずつテストする.
	for i, exInfo := range cafesInfo {
		var cafeInfo = reponse.Data[i]
		assert.Equal(t, cafeInfo.Id, exInfo.Id)
		assert.Equal(t, cafeInfo.Zipcode, exInfo.Zipcode)
		assert.Equal(t, cafeInfo.PrefectureId, exInfo.PrefectureId)
		assert.Equal(t, cafeInfo.Prefecture, exInfo.Prefecture)
		assert.Equal(t, cafeInfo.City, exInfo.City)
		assert.Equal(t, cafeInfo.Street, exInfo.Street)
		assert.Equal(t, cafeInfo.BusinessHours, exInfo.BusinessHours)
		assert.Equal(t, cafeInfo.Rating, exInfo.Rating)
		// assert.Equal(t, cafeInfo.CreatedAt, exInfo.CreatedAt)
		// assert.Equal(t, cafeInfo.UpdatedAt, exInfo.UpdatedAt)
	}
}

func TestGetCafe(t *testing.T) {
	w := request("GET", "/cafes/1", nil)
	t.Log(w.Body.String())

	type cafeResponse struct {
		response
		Data repository.CafeInfo `json:"data"`
	}
	var response cafeResponse

	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.response.Message, "ok")

	// 入力値と期待値を1件ずつテストする.
	var exInfo = cafesInfo[0]
	var cafeInfo = response.Data
	assert.Equal(t, cafeInfo.Id, exInfo.Id)
	assert.Equal(t, cafeInfo.Zipcode, exInfo.Zipcode)
	assert.Equal(t, cafeInfo.PrefectureId, exInfo.PrefectureId)
	assert.Equal(t, cafeInfo.Prefecture, exInfo.Prefecture)
	assert.Equal(t, cafeInfo.City, exInfo.City)
	assert.Equal(t, cafeInfo.Street, exInfo.Street)
	assert.Equal(t, cafeInfo.BusinessHours, exInfo.BusinessHours)
	assert.Equal(t, cafeInfo.Rating, exInfo.Rating)
	// assert.Equal(t, cafeInfo.CreatedAt, exInfo.CreatedAt)
	// assert.Equal(t, cafeInfo.UpdatedAt, exInfo.UpdatedAt)

}

func TestPostCafe(t *testing.T) {
	cafe := entity.Cafes{
		Name:          "testCafe",
		Zipcode:       "1111111",
		PrefectureId:  1,
		City:          "testCity",
		Street:        "testStreet",
		BusinessHours: "営業時間",
	}
	jsonValue, _ := json.Marshal(cafe)
	t.Log(jsonValue)

	w := request("POST", "/cafes", bytes.NewBuffer(jsonValue))
	t.Log(w.Body.String())

	var response response
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "登録処理が完了しました。管理人が確認するまでお待ちください。")

}

func TestPostFavorite(t *testing.T) {

	w := request("POST", "/cafes/2/favorite", nil)
	t.Log(w.Body.String())

	var response response
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "お気に入りに登録しました。")

}

func TestDeleteFavorite(t *testing.T) {
	w := request("DELETE", "/cafes/4/favorite", nil)
	t.Log(w.Body.String())

	var response response
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "お気に入りから削除しました。")

}

func TestGetUsers(t *testing.T) {
	w := request("GET", "/users/:id", nil)
	t.Log(w.Body.String())

	var response response
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "お気に入りから削除しました。")

}
