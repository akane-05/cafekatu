package repository

import (
	"log"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type CafesRepository interface {
	// GetCafes() (cafes []entity.CafeEntity, err error)
	GetCafes() (cafeInfos []entity.CafeInfo, err error)
	GetCafe(id int) (cafeInfo entity.CafeInfo, err error)
}

// 構造体の宣言
type cafesRepository struct {
}

// cafesRepositoryのコンストラクタ
func NewCafesRepository() CafesRepository {
	return &cafesRepository{}
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) GetCafes() (cafeInfos []entity.CafeInfo, err error) {
	log.Println("リポジトリ")

	//名前付き変数
	// Db.Table("cafes").Select("cafes.id,cafes.name,cafes.prefecture_id,cafes.city,cafes.street,cafes.business_hours,cafes.created_at,cafes.updated_at,AVG(comments.rating").Joins("left join comments on cafes.id = comments.id").Group("cafes.id").Find(&cafeInfos)

	Db.Table("cafes").Select("cafes.id,cafes.name,cafes.prefecture_id,cafes.city,cafes.street,cafes.business_hours,cafes.created_at,cafes.updated_at").Find(&cafeInfos)

	if err != nil {
		log.Print(err)
		return
	}

	//名前付き変数でreturn
	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) GetCafe(id int) (cafeInfo entity.CafeInfo, err error) {
	log.Println("リポジトリ")

	//名前付き変数
	// Db.Table("cafes").Select("cafes.id,cafes.name,cafes.prefecture_id,cafes.city,cafes.street,cafes.business_hours,cafes.created_at,cafes.updated_at,AVG(comments.rating").Joins("left join comments on cafes.id = comments.id").Group("cafes.id").Find(&cafeInfos)

	Db.Table("cafes").Where("id = ?", id).Select("cafes.id,cafes.name,cafes.prefecture_id,cafes.city,cafes.street,cafes.business_hours,cafes.created_at,cafes.updated_at").First(&cafeInfo)

	if err != nil {
		log.Print(err)
		return
	}

	//名前付き変数でreturn
	return
}
