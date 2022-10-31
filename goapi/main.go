package main

import (
	"log"
	"time"

	"github.com/akane-05/cafekatu/goapi/controller"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/akane-05/cafekatu/goapi/unit"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
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

func main() {

	log.Println("main.go")

	router := GetRouter()
	router.Run(":8080")

}

func GetRouter() *gin.Engine {
	log.Println("GetRouter")

	r := gin.Default()

	// ここからCorsの設定
	r.Use(cors.New(cors.Config{
		// アクセスを許可したいアクセス元
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		// アクセスを許可したいHTTPメソッド(以下の例だとPUTやDELETEはアクセスできません)
		AllowMethods: []string{
			"POST",
			"GET",
			"DELETE",
			"PUT",
			"OPTIONS",
		},
		// 許可したいHTTPリクエストヘッダ
		AllowHeaders: []string{
			"Access-Control-Allow-Credentials",
			"Access-Control-Allow-Headers",
			"Content-Type",
			"Content-Length",
			"Accept-Encoding",
			"Authorization",
			"Access-Control-Allow-Origin",
		},
		// cookieなどの情報を必要とするかどうか
		AllowCredentials: true,
		// preflightリクエストの結果をキャッシュする時間
		MaxAge: 24 * time.Hour,
	}))

	r.GET("/login", loginC.Login)
	r.POST("/register", loginC.Register)

	group := r.Group("/")
	group.Use(unit.CheckJwtToken)
	{
		group.GET("/cafes", cafesC.GetCafes)
		group.GET("/cafes/:id", cafesC.GetCafe)
		group.POST("/cafes", cafesC.PostCafe)
		group.POST("/cafes/:id/favorite", cafesC.PostFavorite)
		group.PATCH("/cafes/:id/favorite", cafesC.PostFavorite)

		group.GET("/users/:id", usersC.GetUser)
		group.PATCH("/users/:id", usersC.PatchUser)
		group.DELETE("/users/:id", usersC.DeleteUser)

		group.GET("/reviews", reviewsC.GetReviews)
		group.POST("/reviews", reviewsC.PostReview)
		group.DELETE("/reviews/:id", reviewsC.DeleteReview)

	}

	// r.GET("/cafes", cafesC.GetCafes)
	// r.GET("/cafes/:id", cafesC.GetCafe)
	// r.POST("/cafes", cafesC.PostCafe)
	// r.POST("/cafes/:id/favorite", cafesC.PostFavorite)
	// r.DELETE("/cafes/:id/favorite", cafesC.DeleteFavorite)

	// r.GET("/users/:id", usersC.GetUser)
	// r.PATCH("/users/:id", usersC.PatchUser)
	// r.DELETE("/users/:id", usersC.DeleteUser)

	// r.GET("/reviews", reviewsC.GetReviews)
	// r.POST("/reviews", reviewsC.PostReview)
	// r.DELETE("/reviews/:id", reviewsC.DeleteReview)

	r.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "Page not found"})
	})

	return r
}
