package repository

import (
	"log"

	"github.com/akane-05/demo-app/back-app/model/entity"
	_ "github.com/go-sql-driver/mysql"
)

//DIを用いたリポジトリの実装
//インターフェースで実装すべきメソッドを決める
type CafesRepository interface {
	// GetCafes() (cafes []entity.CafeEntity, err error)
	GetCafes() (cafes []entity.CafeInfo, err error)
}

//構造体の宣言
type cafesRepository struct {
}

//cafesRepositoryのコンストラクタ
func NewCafesRepository() CafesRepository {
	return &cafesRepository{}
}

//ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) GetCafes() (cafes []entity.CafeInfo, err error) {
	cafes = []entity.CafeInfo{}

	//SQLを実行
	rows, err := Db.
		Query("SELECT id, name, prefecture_id FROM cafes ORDER BY id DESC")
	if err != nil {
		log.Print(err)
		return
	}

	//検索結果にたいして処理を実行
	for rows.Next() {
		cafe := entity.CafeInfo{}
		err = rows.Scan(&cafe.Id, &cafe.Name, &cafe.PrefectureId)
		if err != nil {
			log.Print(err)
			return
		}

		//[Golang]スライスに要素を追加する「append関数」
		cafes = append(cafes, cafe)
	}

	return
}
