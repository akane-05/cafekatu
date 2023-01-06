package main

import (
	"log"
	"net/http"
	"time"

	"github.com/akane-05/cafekatu/goapi/controller"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/akane-05/cafekatu/goapi/unit"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	healthcheck "github.com/RaMin0/gin-health-check"
)

// DIを行う
var cafesR = repository.NewCafesRepository()
var cafesC = controller.NewCafesController(cafesR)

var usersR = repository.NewUsersRepository()
var usersC = controller.NewUsersController(usersR)

var reviewsR = repository.NewReviewsRepository()
var reviewsC = controller.NewReviewsController(reviewsR)

var loginR = repository.NewLoginRepository()
var loginC = controller.NewLoginController(loginR)

var commonR = repository.NewCommonRepository()
var commonC = controller.NewCommonController(commonR)

func main() {

	log.Println("main.go")

	router := GetRouter()
	router.Run(":8080")

}

func GetRouter() *gin.Engine {
	log.Println("GetRouter")

	r := gin.Default()

	// ここからCorsの設定
	r.Use(
		healthcheck.New(healthcheck.Config{
			HeaderName:   "X-Health-Header",
			HeaderValue:  "1",
			ResponseCode: http.StatusOK,
			ResponseText: "ok",
		}),

		cors.New(cors.Config{
			// アクセスを許可したいアクセス元
			AllowOrigins: []string{
				"http://localhost:3000",
			},
			// アクセスを許可したいHTTPメソッド
			AllowMethods: []string{
				"POST",
				"GET",
				"DELETE",
				"PATCH",
				"OPTIONS",
			},
			// 許可したいHTTPリクエストヘッダ
			AllowHeaders: []string{
				//"Access-Control-Allow-Credentials",
				"Access-Control-Allow-Headers",
				"Content-Type",
				"Content-Length",
				"Accept-Encoding",
				"Authorization",
				"Access-Control-Allow-Origin",
			},
			// cookieなどの情報を必要とするかどうか
			//AllowCredentials: true,
			// preflightリクエストの結果をキャッシュする時間
			MaxAge: 24 * time.Hour,
		}))

	group := r.Group("/")
	group.Use(unit.CheckJwtToken)
	{
		group.GET("/cafes", cafesC.GetCafes)
		group.POST("/cafes", cafesC.PostCafe)
		group.GET("/cafes/:id", cafesC.GetCafe)
		group.POST("/cafes/:id/favorite", cafesC.PostFavorite)
		group.DELETE("/cafes/:id/favorite", cafesC.DeleteFavorite)

		group.GET("/users/:id", usersC.GetUser)
		group.PATCH("/users/:id", usersC.PatchUser)
		group.DELETE("/users/:id", usersC.DeleteUser)
		group.GET("/users/:id/favorites", usersC.GetUserFavorites)
		group.GET("/users/:id/pastPosts", usersC.GetUserPastPosts)

		group.POST("/reviews", reviewsC.PostReview)
		group.GET("/reviews/:id", reviewsC.GetCafesReviews)
		group.DELETE("/reviews/:id", reviewsC.DeleteReview)

	}
	r.POST("/login", loginC.Login)
	r.POST("/register", loginC.Register)
	r.GET("/prefectures", commonC.GetPrefectures)
	r.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"status": http.StatusNotFound, "error": "指定されたページが見つかりませんでした"})
	})

	return r
}
