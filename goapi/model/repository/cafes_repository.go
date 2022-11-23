package repository

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type CafesRepository interface {
	GetCafes(cafeQuery *CafeQuery) (cafeInfos []CafeInfo, err error)
	GetFavoirtes(userId *int, cafes *[]CafeInfo) (cafeIds []int, err error)
	GetCafe(id *int) (cafeInfo CafeInfo, err error)
	InsertCafe(cafe *entity.Cafes) (err error)
	InsertFavorite(favo *entity.Favorites) (err error)
	DeleteFavorite(favo *entity.Favorites) (err error)
	GetCafeReviews(id *int, query *CafeQuery) (reviews []entity.Reviews, err error)
}

// 構造体の宣言
type cafesRepository struct {
}

// cafesRepositoryのコンストラクタ
func NewCafesRepository() CafesRepository {
	return &cafesRepository{}
}

type CafeInfo struct {
	Id            int       `json:"id"`
	Name          string    `json:"name"`
	Zipcode       string    `json:"zipcode"`
	PrefectureId  int       `json:"prefecture_id"`
	Prefecture    string    `json:"prefecture"`
	City          string    `json:"city"`
	Street        string    `json:"street"`
	BusinessHours string    `json:"business_hours"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	Rating        float64   `json:"rating"`
	IsFavorite    bool      `json:"is_favorite"`
}

type CafeQuery struct {
	PerPage    int    `form:"per_page" binding:"required"`
	Page       int    `form:"page" binding:"required"`
	SearchWord string `form:"search_word"`
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) GetCafes(cafeQuery *CafeQuery) (cafeInfos []CafeInfo, err error) {
	log.Println("リポジトリ")

	query := `
	cafes.id,cafes.name,
	cafes.zipcode,cafes.prefecture_id,prefectures.prefecture,cafes.city,cafes.street,
	cafes.business_hours,
	cafes.created_at,cafes.updated_at,
	AVG(reviews.rating) as rating
	`
	join := `join prefectures on cafes.prefecture_id = prefectures.id left join reviews on cafes.id = reviews.cafe_id`

	where := "cafes.approved = 1"
	if cafeQuery.SearchWord != "" {
		shWord := "%" + cafeQuery.SearchWord + "%"
		where = where + " AND (cafes.name LIKE ? OR prefectures.prefecture LIKE ? OR cafes.city LIKE ? OR cafes.street LIKE ? )"
		if err = Db.Debug().Table("cafes").Order("cafes.id").Where(where, shWord, shWord, shWord, shWord).Limit(cafeQuery.PerPage).Offset(cafeQuery.PerPage * (cafeQuery.Page - 1)).Select(query).Joins(join).Group("cafes.id").Find(&cafeInfos).Error; err != nil {
			return
		}
	} else {
		if err = Db.Debug().Table("cafes").Order("cafes.id").Where(where).Limit(cafeQuery.PerPage).Offset(cafeQuery.PerPage * (cafeQuery.Page - 1)).Select(query).Joins(join).Group("cafes.id").Find(&cafeInfos).Error; err != nil {
			return
		}
	}
	//名前付き変数でreturn
	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) GetFavoirtes(userId *int, cafes *[]CafeInfo) (cafeIds []int, err error) {

	subQuery1 := Db.Where("user_id = ?", userId).Model(&entity.Favorites{})

	var shCafes []CafeInfo = *cafes
	var conditions []string
	for _, cafe := range shCafes {
		condition := fmt.Sprintf("cafe_id = %v", cafe.Id)
		conditions = append(conditions, condition)
	}

	where := strings.Join(conditions, " OR ")

	if err = Db.Debug().Table("(?) as userFavo", subQuery1).Where(where).Select("cafe_id").Find(&cafeIds).Error; err != nil {
		return
	}
	//名前付き変数でreturn
	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) GetCafe(id *int) (cafeInfo CafeInfo, err error) {
	log.Println("リポジトリ")

	query := `
	cafes.id,cafes.name,cafes.zipcode,cafes.prefecture_id,prefectures.prefecture,cafes.city,cafes.street,cafes.business_hours,
	cafes.created_at,cafes.updated_at,AVG(reviews.rating) as rating
	`

	join := `join prefectures on cafes.prefecture_id = prefectures.id left join reviews on cafes.id = reviews.cafe_id`

	if err = Db.Debug().Table("cafes").Where("cafes.id = ? and cafes.approved = 1", id).Select(query).Joins(join).Group("cafes.id").First(&cafeInfo).Error; err != nil {
		return
	}

	//名前付き変数でreturn
	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) InsertCafe(cafe *entity.Cafes) (err error) {
	log.Println("リポジトリ InsertCafe")

	if err = Db.Transaction(func(tx *gorm.DB) error {
		// データベース操作をトランザクション内で行う
		if err = tx.Create(&cafe).Error; err != nil {
			// エラーを返した場合はロールバックされる
			return err
		}
		// nil を返すとコミットされる
		return nil
	}); err != nil {
		return
	}

	log.Println("トランザクションが正常に終了しました")
	return

}

func (tr *cafesRepository) InsertFavorite(favo *entity.Favorites) (err error) {
	log.Println("リポジトリ InsertFavorite")

	if err = Db.Transaction(func(tx *gorm.DB) error {
		// データベース操作をトランザクション内で行う
		if err = tx.Create(&favo).Error; err != nil {
			// エラーを返した場合はロールバックされる
			return err
		}
		// nil を返すとコミットされる
		return nil
	}); err != nil {
		return
	}

	log.Println("トランザクションが正常に終了しました")
	return

}

func (tr *cafesRepository) DeleteFavorite(favo *entity.Favorites) (err error) {
	log.Println("リポジトリ DeleteFavorite")

	if err = Db.Transaction(func(tx *gorm.DB) error {
		// データベース操作をトランザクション内で行う
		if err = tx.Unscoped().Where("user_id = ? and cafe_id = ? ", favo.User_id, favo.Cafe_id).Delete(&favo).Error; err != nil {
			// エラーを返した場合はロールバックされる
			return err
		}
		// nil を返すとコミットされる
		return nil
	}); err != nil {
		return
	}

	log.Println("トランザクションが正常に終了しました")
	return

}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *cafesRepository) GetCafeReviews(id *int, query *CafeQuery) (reviews []entity.Reviews, err error) {
	log.Println("リポジトリ GetCafesReviews")

	if err = Db.Debug().Table("reviews").Where("cafe_id = ?", id).Limit(query.PerPage).Offset(query.PerPage * (query.Page - 1)).Find(&reviews).Error; err != nil {
		return
	}
	//名前付き変数でreturn
	return
}
