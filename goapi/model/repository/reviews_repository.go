package repository

import (
	"log"
	"time"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type ReviewsRepository interface {
	//GetUserReviews(userId int, query *ReviewQuery) (reviews []entity.Reviews, err error)
	GetCafesReviews(id *int, query *ReviewQuery) (reviews []Review, err error)
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

type Review struct {
	Id         int       `json:"id"`
	User_id    int       `json:"user_id"`
	Nickname   string    `json:"nickname" binding:"required"`
	Cafe_id    int       `json:"cafe_id" binding:"required"`
	Comment    string    `json:"comment" binding:"required"`
	Rating     float64   `json:"rating" binding:"required"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	IsFavorite bool      `json:"is_favorite"`
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
func (tr *reviewsRepository) GetCafesReviews(id *int, query *ReviewQuery) (reviews []Review, err error) {
	log.Println("リポジトリ GetCafesReviews")

	colume := `reviews.id,reviews.user_id,reviews.cafe_id,reviews.comment,reviews.rating,
	users.nickname,reviews.created_at,reviews.updated_at
	`

	if err = Db.Debug().Table("reviews").Select(colume).Where("cafe_id = ?", id).Limit(query.PerPage).Offset(query.PerPage * (query.Page - 1)).Joins("left join users on reviews.user_id = users.id").Find(&reviews).Error; err != nil {
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
