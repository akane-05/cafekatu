package repository

import (
	"log"

	_ "github.com/go-sql-driver/mysql"
	"github.com/akane-05/demo-app/back-app/model/entity"
)

//DIを用いたリポジトリの実装
//インターフェースで実装すべきメソッドを決める
type DemoRepository interface {
	GetDemos() (demos []entity.DemoEntity, err error)
}

//構造体の宣言
type demoRepository struct {
}

//demoRepositoryのコンストラクタ
func NewDemoRepository() DemoRepository {
	return &demoRepository{}
}

//ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *demoRepository) GetDemos() (demos []entity.DemoEntity, err error) {
	demos = []entity.DemoEntity{}
	rows, err := Db.
		Query("SELECT id, name, prefecture_id FROM cafes ORDER BY id DESC")
	if err != nil {
		log.Print(err)
		return
	}

	for rows.Next() {
		demo := entity.DemoEntity{}
		err = rows.Scan(&demo.Id, &demo.Name, &demo.PrefectureId)
		if err != nil {
			log.Print(err)
			return
		}
		demos = append(demos, demo)
	}

	return
}
