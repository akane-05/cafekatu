package repository

import (
	"log"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type CafesRepository interface {
	GetCafes() (cafeInfos []CafeInfo, err error)
	GetCafe(id int) (cafeInfo CafeInfo, err error)
	InsertCafe(cafe entity.CafeEntity) (err error)
}

// 構造体の宣言
type cafesRepository struct {
}

// cafesRepositoryのコンストラクタ
func NewCafesRepository() CafesRepository {
	return &cafesRepository{}
}

type CafeInfo struct {
	Id            int     `json:"id"`
	Name          string  `json:"name"`
	Zipcode       string  `json:"zipcode"`
	PrefectureId  int     `json:"prefecture_id"`
	City          string  `json:"city"`
	Street        string  `json:"street"`
	BusinessHours string  `json:"business_hours"`
	CreatedAt     string  `json:"created_at"`
	UpdatedAt     string  `json:"updated_at"`
	Rating        float32 `json:"rating"`
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) GetCafes() (cafeInfos []CafeInfo, err error) {
	log.Println("リポジトリ")

	//名前付き変数
	if err = Db.Debug().Table("cafes").Select("cafes.id,cafes.name,cafes.zipcode,cafes.prefecture_id,cafes.city,cafes.street,cafes.business_hours,cafes.created_at,cafes.updated_at,AVG(reviews.rating) as rating").Joins("left join reviews on cafes.id = reviews.cafe_id").Group("cafes.id").Find(&cafeInfos).Error; err != nil {
		log.Print(err)
		return
	}

	//名前付き変数でreturn
	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) GetCafe(id int) (cafeInfo CafeInfo, err error) {
	log.Println("リポジトリ")

	if err = Db.Debug().Table("cafes").Where("cafes.id = ?", id).Select("cafes.id,cafes.name,cafes.zipcode,cafes.prefecture_id,cafes.city,cafes.street,cafes.business_hours,cafes.created_at,cafes.updated_at,AVG(reviews.rating) as rating").Joins("left join reviews on cafes.id = reviews.cafe_id").Group("cafes.id").First(&cafeInfo).Error; err != nil {
		log.Print(err)
		return
	}

	//名前付き変数でreturn
	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) InsertCafe(cafe entity.CafeEntity) (err error) {
	log.Println("リポジトリ InsertCafe")

	if err = Db.Transaction(func(tx *gorm.DB) error {
		// データベース操作をトランザクション内で行う
		if e := tx.Create(&cafe).Error; e != nil {
			// エラーを返した場合はロールバックされる
			return e
		}
		// nil を返すとコミットされる
		return nil
	}); err != nil {
		log.Print(err)
		log.Print("トランザクション内でエラーが発生しました")
		return
	}

	log.Print("トランザクションが正常に終了しました")
	// return

	//created_atが最新のcafeのIDを返却
	// if err = Db.Debug().Table("cafes").Select("id").First(&id).Error; err != nil {
	// 	log.Print(err)
	// 	return
	// }

	return

}
