package repository

import (
	"log"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type ReviewsRepository interface {
	//GetUserReviews(userId int, query *ReviewQuery) (reviews []entity.Reviews, err error)
	GetCafesReviews(id *int, query *ReviewQuery) (reviews []entity.Reviews, err error)
	GetReviewsTotal(id *int) (reviewsTotal int64, err error)
	InsertReview(review *entity.Reviews) (err error)
	DeleteReview(review *entity.Reviews) (err error)
}

// 構造体の宣言
type reviewsRepository struct {
}

// cafesRepositoryのコンストラクタ
func NewReviewsRepository() ReviewsRepository {
	return &reviewsRepository{}
}

type ReviewQuery struct {
	PerPage int `form:"per_page" binding:"required"`
	Page    int `form:"page" binding:"required"`
}

// // ポインタレシーバ(*demoRepository)にメソッドを追加
// func (tr *reviewsRepository) GetUserReviews(userId int, query *ReviewQuery) (reviews []entity.Reviews, err error) {
// 	log.Println("リポジトリ GetUserReviews")

// 	if err = Db.Debug().Table("reviews").Where("user_id = ?", userId).Limit(query.PerPage).Offset(query.PerPage * (query.Page - 1)).Find(&reviews).Error; err != nil {
// 		return
// 	}
// 	//名前付き変数でreturn
// 	return
// }

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *reviewsRepository) GetCafesReviews(id *int, query *ReviewQuery) (reviews []entity.Reviews, err error) {
	log.Println("リポジトリ GetCafesReviews")

	if err = Db.Debug().Table("reviews").Where("cafe_id = ?", id).Limit(query.PerPage).Offset(query.PerPage * (query.Page - 1)).Find(&reviews).Error; err != nil {
		return
	}
	//名前付き変数でreturn
	return
}

func (tr *reviewsRepository) GetReviewsTotal(id *int) (reviewsTotal int64, err error) {

	if err = Db.Debug().Model(&entity.Reviews{}).Where("cafe_id = ?", id).Count(&reviewsTotal).Error; err != nil {
		return
	}

	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *reviewsRepository) InsertReview(review *entity.Reviews) (err error) {
	log.Println("リポジトリ InsertReview")

	if err = Db.Transaction(func(tx *gorm.DB) error {
		// データベース操作をトランザクション内で行う
		if err = tx.Create(&review).Error; err != nil {
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

func (tr *reviewsRepository) DeleteReview(review *entity.Reviews) (err error) {
	log.Println("リポジトリ DeleteReview")

	if err = Db.Transaction(func(tx *gorm.DB) error {
		// データベース操作をトランザクション内で行う
		if err = tx.Delete(&review).Error; err != nil {
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
