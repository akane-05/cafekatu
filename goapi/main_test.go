package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
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
	"github.com/go-testfixtures/testfixtures"
)

// testデータ作成
var (
	db       *sql.DB
	fixtures *testfixtures.Context
)

func TestMain(m *testing.M) {
	var err error

	user := os.Getenv("MYSQL_USER")
	pass := os.Getenv("MYSQL_PASSWORD")
	protocol := os.Getenv("MYSQL_PROTOCOL")
	database := os.Getenv("MYSQL_DATABASE")

	path := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=true", user, pass, protocol, database)
	db, err = sql.Open("mysql", path)
	if err != nil {
		log.Printf("DB接続でエラーが発生しました")
	}

	fixtures, err = testfixtures.NewFolder(db, &testfixtures.MySQL{}, "testdata/fixtures")
	if err != nil {
		log.Fatal(err)
	}

	if err != nil {
		log.Printf("testfixturesでDB接続でエラーが発生しました")
	}

	os.Exit(m.Run())
}

func prepareTestDatabase() {
	if err := fixtures.Load(); err != nil {
		log.Fatal(err)
	}
}

// jwtトークンを確認、作成メソッド
var (
	testTime = time.Now()
	jwtInfo  = unit.JwtInfo{Id: 1, Email: "user1@email.com", ExTime: testTime}
)

func createTestTaken(jwtInfo unit.JwtInfo) (tokenString string) {
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

// レスポンス構造体
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
var (
	cafesInfo = []repository.CafeInfo{
		repository.CafeInfo{1, "お菓子の家", "0600042", 1, "北海道", "札幌市", "大通１", "11時から15時まで", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3.6, false},
		repository.CafeInfo{2, "coffee shop", "0300846", 2, "青森県", "青森市", "青葉", "8時から12時まで", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3, false},
		repository.CafeInfo{3, "喫茶東京", "1040044", 13, "東京都", "中央区", "明石町", "毎週土曜日定休日", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 5, false},
	}

	exUserInfo = entity.Users{
		Id:       1,
		Email:    "user1@email.com",
		Nickname: "ユーザー1",
	}

	reviewsInfo = []entity.Reviews{
		entity.Reviews{1, 1, 1, "ケーキが美味しかった", 2, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Reviews{5, 1, 4, "オムレツが美味しい", 4, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Reviews{6, 1, 4, "エスプレッソが香り高い", 4.5, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Reviews{7, 1, 4, "雰囲気が素敵", 2.9, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Reviews{8, 1, 5, "無添加のお菓子が美味しい", 3.6, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
	}

	cafeReviews = []entity.Reviews{
		entity.Reviews{1, 1, 1, "ケーキが美味しかった", 2, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Reviews{4, 2, 1, "ケーキが絶品", 4, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Reviews{10, 3, 1, "お米が美味しい", 5, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
	}

	prefectures = []entity.Prefectures{
		entity.Prefectures{1, "北海道", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Prefectures{2, "青森県", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Prefectures{13, "東京都", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Prefectures{38, "愛知県", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		entity.Prefectures{47, "沖縄県", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
	}

	cafeFreeWord = []repository.CafeInfo{
		repository.CafeInfo{3, "喫茶東京", "1040044", 13, "東京都", "中央区", "明石町", "毎週土曜日定休日", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 5, false},
		repository.CafeInfo{6, "純喫茶", "1330052", 13, "東京都", "江戸川区", "小岩", "AM6:00 ~ PM13:00", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 0, false},
	}

	pastPost1 = controller.PastPost{
		CafeInfo: repository.CafeInfo{1, "お菓子の家", "0600042", 1, "北海道", "札幌市", "大通１", "11時から15時まで", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3.6, true},
		Reviews: []entity.Reviews{
			entity.Reviews{1, 1, 1, "ケーキが美味しかった", 2, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		},
	}

	pastPost2 = controller.PastPost{
		CafeInfo: repository.CafeInfo{4, "海の家", "9000002", 47, "沖縄県", "那覇市", "曙", "13時から", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3.8, true},
		Reviews: []entity.Reviews{
			entity.Reviews{5, 1, 4, "オムレツが美味しい", 4, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
			entity.Reviews{6, 1, 4, "エスプレッソが香り高い", 4.5, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
			entity.Reviews{7, 1, 4, "雰囲気が素敵", 2.9, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		},
	}

	pastPost3 = controller.PastPost{
		CafeInfo: repository.CafeInfo{5, "morning", "4520813", 38, "愛知県", "名古屋市", "西区", "年中無休", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3.4, false},
		Reviews: []entity.Reviews{
			entity.Reviews{8, 1, 5, "無添加のお菓子が美味しい", 3.6, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
			entity.Reviews{9, 1, 5, "ランチが絶品", 3.2, time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local)},
		},
	}

	pastPosts = []controller.PastPost{
		pastPost1, pastPost2, pastPost3,
	}

	cafeFavorites = []repository.CafeInfo{
		repository.CafeInfo{1, "お菓子の家", "0600042", 1, "北海道", "札幌市", "大通１", "11時から15時まで", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3.6, false},
		repository.CafeInfo{4, "海の家", "9000002", 47, "沖縄県", "那覇市", "曙", "13時から", time.Date(2022, 10, 1, 9, 0, 0, 0, time.Local), time.Date(2022, 11, 1, 12, 0, 0, 0, time.Local), 3.8, false},
	}
)

// リクエストメソッド
func request(method string, url string, body io.Reader, token string) (w *httptest.ResponseRecorder) {

	r := GetRouter()
	w = httptest.NewRecorder()
	req, _ := http.NewRequest(method, url, body)

	if url != "/register" && url != "/login" {

		req.Header.Add("Authorization", token)
	}

	r.ServeHTTP(w, req)

	return

}

// 以下テスト
func TestRegister(t *testing.T) {
	prepareTestDatabase()

	registerInfo := controller.RegisterInfo{
		Email:    "register@email.com",
		Password: "password",
		Nickname: "登録ニックネーム",
	}
	jsonValue, _ := json.Marshal(registerInfo)

	w := request("POST", "/register", bytes.NewBuffer(jsonValue), "")
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
	email, id, err := checkTestJwtToken("Bearer " + response.Token)
	if err != nil {
		log.Fatal(err.Error())
	}
	assert.Equal(t, email, "register@email.com")
	assert.Equal(t, id, 4)

}

func TestLogin(t *testing.T) {
	prepareTestDatabase()

	loginInfo := controller.LoginInfo{
		Email:    "user1@email.com",
		Password: "password",
	}
	jsonValue, _ := json.Marshal(loginInfo)
	w := request("POST", "/login", bytes.NewBuffer(jsonValue), "")
	t.Log(w.Body.String())

	var response loginResponse
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err.Error())
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.response.Message, "ログインしました。")

	//jwt
	email, id, err := checkTestJwtToken("Bearer " + response.Token)
	if err != nil {
		log.Fatal(err.Error())
	}
	assert.Equal(t, email, "user1@email.com")
	assert.Equal(t, id, 1)

}

func TestGetCafesList(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("GET", "/cafes?per_page=5&page=1", nil, token)
	t.Log(w.Body.String())

	type cafesResponse struct {
		response
		Data controller.CafesResponse `json:"data"`
	}
	var reponse cafesResponse

	if err := json.Unmarshal(w.Body.Bytes(), &reponse); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, reponse.response.Message, "ok")

	assert.Equal(t, reponse.Data.CafesTotal, 6)
	assert.Equal(t, reponse.Data.PagesTotal, 2)

	// 入力値と期待値を1件ずつテストする.
	for i, exInfo := range cafesInfo {
		var cafeInfo = reponse.Data.Cafes[i]
		assert.Equal(t, cafeInfo.Id, exInfo.Id)
		assert.Equal(t, cafeInfo.Zipcode, exInfo.Zipcode)
		assert.Equal(t, cafeInfo.PrefectureId, exInfo.PrefectureId)
		assert.Equal(t, cafeInfo.Prefecture, exInfo.Prefecture)
		assert.Equal(t, cafeInfo.City, exInfo.City)
		assert.Equal(t, cafeInfo.Street, exInfo.Street)
		assert.Equal(t, cafeInfo.BusinessHours, exInfo.BusinessHours)
		assert.Equal(t, cafeInfo.Rating, exInfo.Rating)
		assert.Equal(t, cafeInfo.CreatedAt.Unix(), exInfo.CreatedAt.Unix())
		assert.Equal(t, cafeInfo.UpdatedAt.Unix(), exInfo.UpdatedAt.Unix())
	}
}

func TestGetCafesFreeWord(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("GET", "/cafes?per_page=5&page=1&search_word=東京", nil, token)
	t.Log(w.Body.String())

	type cafesResponse struct {
		response
		Data controller.CafesResponse `json:"data"`
	}
	var reponse cafesResponse

	if err := json.Unmarshal(w.Body.Bytes(), &reponse); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, reponse.response.Message, "ok")

	assert.Equal(t, reponse.Data.CafesTotal, 2)
	assert.Equal(t, reponse.Data.PagesTotal, 1)

	// 入力値と期待値を1件ずつテストする.
	for i, exInfo := range cafeFreeWord {
		var cafeInfo = reponse.Data.Cafes[i]
		assert.Equal(t, cafeInfo.Id, exInfo.Id)
		assert.Equal(t, cafeInfo.Zipcode, exInfo.Zipcode)
		assert.Equal(t, cafeInfo.PrefectureId, exInfo.PrefectureId)
		assert.Equal(t, cafeInfo.Prefecture, exInfo.Prefecture)
		assert.Equal(t, cafeInfo.City, exInfo.City)
		assert.Equal(t, cafeInfo.Street, exInfo.Street)
		assert.Equal(t, cafeInfo.BusinessHours, exInfo.BusinessHours)
		assert.Equal(t, cafeInfo.Rating, exInfo.Rating)
		assert.Equal(t, cafeInfo.CreatedAt.Unix(), exInfo.CreatedAt.Unix())
		assert.Equal(t, cafeInfo.UpdatedAt.Unix(), exInfo.UpdatedAt.Unix())

	}
}

func TestGetCafeSingle(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("GET", "/cafes/1", nil, token)
	t.Log(w.Body.String())

	type cafeResponse struct {
		response
		Data controller.CafeResponse `json:"data"`
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
	var cafeInfo = response.Data.Cafe
	assert.Equal(t, cafeInfo.Id, exInfo.Id)
	assert.Equal(t, cafeInfo.Zipcode, exInfo.Zipcode)
	assert.Equal(t, cafeInfo.PrefectureId, exInfo.PrefectureId)
	assert.Equal(t, cafeInfo.Prefecture, exInfo.Prefecture)
	assert.Equal(t, cafeInfo.City, exInfo.City)
	assert.Equal(t, cafeInfo.Street, exInfo.Street)
	assert.Equal(t, cafeInfo.BusinessHours, exInfo.BusinessHours)
	assert.Equal(t, cafeInfo.Rating, exInfo.Rating)
	assert.Equal(t, cafeInfo.CreatedAt.Unix(), exInfo.CreatedAt.Unix())
	assert.Equal(t, cafeInfo.UpdatedAt.Unix(), exInfo.UpdatedAt.Unix())

}

func TestPostCafe(t *testing.T) {
	prepareTestDatabase()

	cafe := entity.Cafes{
		Name:          "testCafe",
		Zipcode:       "1111111",
		PrefectureId:  1,
		City:          "testCity",
		Street:        "testStreet",
		BusinessHours: "営業時間",
	}
	jsonValue, _ := json.Marshal(cafe)

	token := createTestTaken(jwtInfo)
	w := request("POST", "/cafes", bytes.NewBuffer(jsonValue), token)
	t.Log(w.Body.String())

	var response response
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "店舗情報を登録しました。管理人が確認後、店舗情報が反映されます。")

}

func TestPostFavorite(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("POST", "/cafes/2/favorite", nil, token)
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
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("DELETE", "/cafes/1/favorite", nil, token)
	t.Log(w.Body.String())

	var response response
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "お気に入りから削除しました。")

}

func TestGetUserInfo(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("GET", "/users/1", nil, token)
	t.Log(w.Body.String())

	type userResponse struct {
		response
		Data entity.Users `json:"data"`
	}
	var response userResponse

	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.response.Message, "ok")

	// 入力値と期待値を1件ずつテストする.
	var userInfo = response.Data
	assert.Equal(t, userInfo.Id, exUserInfo.Id)
	assert.Equal(t, userInfo.Email, exUserInfo.Email)
	assert.Equal(t, userInfo.Nickname, exUserInfo.Nickname)

}

func TestGetUserFavorites(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("GET", "/users/1/favorites?per_page=10&page=1", nil, token)
	t.Log(w.Body.String())

	type FavoritesRes struct {
		response
		Data controller.CafesResponse `json:"data"`
	}
	var response FavoritesRes

	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.response.Message, "ok")

	assert.Equal(t, response.Data.CafesTotal, 2)
	assert.Equal(t, response.Data.PagesTotal, 1)

	// 入力値と期待値を1件ずつテストする.
	for i, exInfo := range cafeFavorites {
		var cafeInfo = response.Data.Cafes[i]
		assert.Equal(t, cafeInfo.Id, exInfo.Id)
		assert.Equal(t, cafeInfo.Zipcode, exInfo.Zipcode)
		assert.Equal(t, cafeInfo.PrefectureId, exInfo.PrefectureId)
		assert.Equal(t, cafeInfo.Prefecture, exInfo.Prefecture)
		assert.Equal(t, cafeInfo.City, exInfo.City)
		assert.Equal(t, cafeInfo.Street, exInfo.Street)
		assert.Equal(t, cafeInfo.BusinessHours, exInfo.BusinessHours)
		assert.Equal(t, cafeInfo.Rating, exInfo.Rating)
		assert.Equal(t, cafeInfo.CreatedAt.Unix(), exInfo.CreatedAt.Unix())
		assert.Equal(t, cafeInfo.UpdatedAt.Unix(), exInfo.UpdatedAt.Unix())
	}

}

func TestGetUserPastPosts(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("GET", "/users/1/pastPosts?per_page=10&page=1", nil, token)
	t.Log(w.Body.String())

	type PastPostsRes struct {
		response
		Data controller.PastPostRes `json:"data"`
	}
	var response PastPostsRes

	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.response.Message, "ok")

	assert.Equal(t, response.Data.CafesTotal, 3)
	assert.Equal(t, response.Data.PagesTotal, 1)

	// 入力値と期待値を1件ずつテストする.
	for i, exInfo := range pastPosts {
		var postData = response.Data.PastPosts[i]
		var exCafeInfo = exInfo.CafeInfo
		var cafeInfo = postData.CafeInfo
		assert.Equal(t, cafeInfo.Id, exCafeInfo.Id)
		assert.Equal(t, cafeInfo.Zipcode, exCafeInfo.Zipcode)
		assert.Equal(t, cafeInfo.PrefectureId, exCafeInfo.PrefectureId)
		assert.Equal(t, cafeInfo.Prefecture, exCafeInfo.Prefecture)
		assert.Equal(t, cafeInfo.City, exCafeInfo.City)
		assert.Equal(t, cafeInfo.Street, exCafeInfo.Street)
		assert.Equal(t, cafeInfo.BusinessHours, exCafeInfo.BusinessHours)
		assert.Equal(t, cafeInfo.CreatedAt.Unix(), exCafeInfo.CreatedAt.Unix())
		assert.Equal(t, cafeInfo.UpdatedAt.Unix(), exCafeInfo.UpdatedAt.Unix())
		assert.Equal(t, cafeInfo.Rating, exCafeInfo.Rating)
		assert.Equal(t, cafeInfo.IsFavorite, exCafeInfo.IsFavorite)
		for i, exReview := range exInfo.Reviews {
			var review = postData.Reviews[i]
			assert.Equal(t, review.Id, exReview.Id)
			assert.Equal(t, review.User_id, exReview.User_id)
			assert.Equal(t, review.Cafe_id, exReview.Cafe_id)
			assert.Equal(t, review.Comment, exReview.Comment)
			assert.Equal(t, review.Rating, exReview.Rating)
			assert.Equal(t, review.CreatedAt.Unix(), exReview.CreatedAt.Unix())
			assert.Equal(t, review.UpdatedAt.Unix(), exReview.UpdatedAt.Unix())

		}

	}

}

func TestUpdateUserInfo(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)

	updateInfo := repository.UpdateInfo{
		Email:    "update1@email.com",
		Password: "password",
		Nickname: "更新ユーザー",
	}
	jsonValue, _ := json.Marshal(updateInfo)

	w := request("PATCH", "/users/1", bytes.NewBuffer(jsonValue), token)
	t.Log(w.Body.String())

	type userUpdRes struct {
		response
		Token    string `json:"token"`
		Id       int64  `json:"id"`
		Email    string `json:"email"`
		Nickname string `json:"nickname"`
	}
	var response userUpdRes
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Id, 1)
	assert.Equal(t, response.Email, "update1@email.com")
	assert.Equal(t, response.Nickname, "更新ユーザー")
	assert.Equal(t, response.Message, "ユーザー情報を更新しました。")

	//jwt
	email, id, err := checkTestJwtToken("Bearer " + response.Token)
	if err != nil {
		log.Fatal(err.Error())
	}
	assert.Equal(t, email, "update1@email.com")
	assert.Equal(t, id, 1)

}

func TestDeleteUser(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("DELETE", "/users/1", nil, token)
	t.Log(w.Body.String())

	var response response
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "ユーザーを削除しました。")

}

func TestGetReviews(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("GET", "/reviews/1?per_page=10&page=1", nil, token)
	t.Log(w.Body.String())

	type reviewsRes struct {
		response
		Data controller.ReviewsResponse `json:"Data"`
	}

	var response reviewsRes

	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "ok")

	// assert
	assert.Equal(t, response.Data.ReviewsTotal, 3)
	assert.Equal(t, response.Data.PagesTotal, 1)

	for i, exReview := range cafeReviews {
		var review = response.Data.Reviews[i]
		assert.Equal(t, review.Id, exReview.Id)
		assert.Equal(t, review.User_id, exReview.User_id)
		assert.Equal(t, review.Cafe_id, exReview.Cafe_id)
		assert.Equal(t, review.Comment, exReview.Comment)
		assert.Equal(t, review.Rating, exReview.Rating)
		assert.Equal(t, review.CreatedAt.Unix(), exReview.CreatedAt.Unix())
		assert.Equal(t, review.UpdatedAt.Unix(), exReview.UpdatedAt.Unix())
	}

}

func TestPostReviews(t *testing.T) {
	prepareTestDatabase()

	review := entity.Reviews{
		Cafe_id: 2,
		Comment: "テストコメント",
		Rating:  3.3,
	}
	jsonValue, _ := json.Marshal(review)

	token := createTestTaken(jwtInfo)
	w := request("POST", "/reviews", bytes.NewBuffer(jsonValue), token)
	t.Log(w.Body.String())

	var response response
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "レビューを投稿しました。")

}

func TestDeleteReviews(t *testing.T) {
	prepareTestDatabase()

	token := createTestTaken(jwtInfo)
	w := request("DELETE", "/reviews/1", nil, token)
	t.Log(w.Body.String())

	var response response
	if err := json.Unmarshal(w.Body.Bytes(), &response); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, response.Message, "レビューを削除しました。")

}

func TestGetPrefectures(t *testing.T) {
	prepareTestDatabase()

	w := request("GET", "/prefectures", nil, "")
	t.Log(w.Body.String())

	type prefecturesResponse struct {
		response
		Data []entity.Prefectures `json:"data"`
	}
	var reponse prefecturesResponse

	if err := json.Unmarshal(w.Body.Bytes(), &reponse); err != nil {
		log.Fatal(err)
	}

	// assert
	assert.Equal(t, http.StatusOK, w.Code)
	assert.Equal(t, reponse.response.Message, "ok")

	// 入力値と期待値を1件ずつテストする.
	for i, exInfo := range prefectures {
		var prefecture = reponse.Data[i]
		assert.Equal(t, prefecture.Id, exInfo.Id)
		assert.Equal(t, prefecture.Prefecture, exInfo.Prefecture)
		assert.Equal(t, prefecture.CreatedAt.Unix(), exInfo.CreatedAt.Unix())
		assert.Equal(t, prefecture.UpdatedAt.Unix(), exInfo.UpdatedAt.Unix())
	}

}
