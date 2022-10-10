package repository

import (
	"database/sql"
	"fmt"
)

var Db *sql.DB

// initはパッケージの初期化に用いる
// repositoryがimportされた時点で動作して、main.goよりも先に実行される
// dataSourceNameはDNS(データソース名)
func init() {
	var err error
	dataSourceName := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8",
		"root", "cafe-password", "db:3306", "cafekatu_db",
	)
	Db, err = sql.Open("mysql", dataSourceName)
	if err != nil {
		panic(err)
	}
}
