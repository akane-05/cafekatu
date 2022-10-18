package main

import (
	"log"

	"github.com/akane-05/cafekatu/goapi/controller"
	"github.com/akane-05/cafekatu/goapi/model/repository"
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
	r.GET("/cafes", dc.GetCafes)
	r.GET("/cafes/:id", dc.GetCafe)
	r.POST("/cafes", dc.PostCafe)
	return r
}
