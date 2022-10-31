package repository

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Db *gorm.DB

// initはパッケージの初期化に用いる
// repositoryがimportされた時点で動作して、main.goよりも先に実行される
// dataSourceNameはDNS(データソース名)
func init() {

	log.Println("読み込み")

	user := os.Getenv("MYSQL_USER")
	pass := os.Getenv("MYSQL_PASSWORD")
	protocol := os.Getenv("MYSQL_PROTOCOL")
	database := os.Getenv("MYSQL_DATABASE")

	var path string = fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8&parseTime=true", user, pass, protocol, database)
	dialector := mysql.Open(path)
	var err error
	if Db, err = gorm.Open(dialector); err != nil {
		connect(dialector, 100)
	}
	log.Println("db connected!!")
}

func connect(dialector gorm.Dialector, count uint) {
	var err error
	if Db, err = gorm.Open(dialector); err != nil {
		if count > 1 {
			time.Sleep(time.Second * 2)
			count--
			log.Printf("retry... count:%v\n", count)
			connect(dialector, count)
			return
		}
		panic(err.Error())
	}
}
