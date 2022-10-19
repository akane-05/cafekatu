package main

import (
	"log"
	"time"

	"github.com/akane-05/cafekatu/goapi/controller"
	"github.com/akane-05/cafekatu/goapi/model/repository"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// DIを行う
var dr = repository.NewCafesRepository()
var dc = controller.NewCafesController(dr)

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

	r.GET("/cafes", dc.GetCafes)
	r.GET("/cafes/:id", dc.GetCafe)
	r.POST("/cafes", dc.PostCafe)
	return r
}
