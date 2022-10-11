package repository

import (
	"database/sql"
	"fmt"
	"log"
	"os"
)

var Db *sql.DB

// initはパッケージの初期化に用いる
// repositoryがimportされた時点で動作して、main.goよりも先に実行される
// dataSourceNameはDNS(データソース名)
func init() {

	log.Println("読み込み")

	user := os.Getenv("MYSQL_USER")
	pass := os.Getenv("MYSQL_PASSWORD")
	protocol := os.Getenv("MYSQL_PROTOCOL")
	database := os.Getenv("MYSQL_DATABASE")

	var err error
	dataSourceName := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8",
		user, pass, protocol, database,
	)
	Db, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		panic(err)
	}
}
