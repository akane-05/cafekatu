package repository

import (
	"fmt"
	"log"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type UsersRepository interface {
	GetUser(id *int) (user entity.Users, err error)
	GetUserFavorites(query *UserQuery) (cafeInfos []CafeInfo, err error)
	GetCafesTotal(query *UserQuery) (cafesTotal int64, err error)
	UpdateUser(patchUserInfo PatchUserInfo) (err error)
	DeleteUser(user *entity.Users) (err error)
	GetUserReviews(id *int, query *UserQuery) (reviews []entity.Reviews, err error)
}

// 構造体の宣言
type usersRepository struct {
}

// cafesRepositoryのコンストラクタ
func NewUsersRepository() UsersRepository {
	return &usersRepository{}
}

type PatchUserInfo struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Nickname string `json:"nickname"`
}

type UserQuery struct {
	PerPage int `form:"per_page" binding:"required"`
	Page    int `form:"page" binding:"required"`
	User_id int `form:"user_id" `
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *usersRepository) GetUser(id *int) (user entity.Users, err error) {
	log.Println("リポジトリ GetUser")

	query := "id,email,nickname"

	if err = Db.Debug().Table("users").Where("id = ?", id).Select(query).First(&user).Error; err != nil {
		return
	}
	//名前付き変数でreturn
	return
}

func (tr *usersRepository) GetUserFavorites(query *UserQuery) (cafeInfos []CafeInfo, err error) {
	log.Println("リポジトリ")

	column := `
	cafes.id,cafes.name,
	cafes.zipcode,cafes.prefecture_id,prefectures.prefecture,cafes.city,cafes.street,
	cafes.business_hours,
	cafes.created_at,cafes.updated_at,
	AVG(reviews.rating) as rating
	`

	inquiry := fmt.Sprintf("join (select * from favorites where user_id = %v ) as userFavorites on userFavorites.cafe_id = cafes.id ", query.User_id)

	join := `join prefectures on cafes.prefecture_id = prefectures.id left join reviews on cafes.id = reviews.cafe_id`

	where := "cafes.approved = 1"

	if err = Db.Debug().Table("cafes").Order("cafes.id").Where(where).Limit(query.PerPage).Offset(query.PerPage * (query.Page - 1)).Select(column).Joins(inquiry + join).Group("cafes.id").Find(&cafeInfos).Error; err != nil {
		return
	}

	return

}

func (tr *usersRepository) GetCafesTotal(query *UserQuery) (cafesTotal int64, err error) {

	where := "cafes.approved = 1"
	inquiry := fmt.Sprintf("join (select * from favorites where user_id = %v ) as userFavorites on userFavorites.cafe_id = cafes.id ", query.User_id)

	if err = Db.Debug().Model(&entity.Cafes{}).Joins(inquiry).Where(where).Count(&cafesTotal).Error; err != nil {
		return
	}

	return
}

func (tr *usersRepository) UpdateUser(patchUserInfo PatchUserInfo) (err error) {
	log.Println("リポジトリ UpdateUser")

	// if err = Db.Transaction(func(tx *gorm.DB) error {
	// 	// データベース操作をトランザクション内で行う
	// 	if err = tx.Table("user").Where("id = ?", patchUserInfo.Id).Update("name", "hello").Error; err != nil {
	// 		// エラーを返した場合はロールバックされる
	// 		return err
	// 	}
	// 	// nil を返すとコミットされる
	// 	return nil
	// }); err != nil {
	// 	return
	// }

	log.Println("トランザクションが正常に終了しました")
	return

}

func (tr *usersRepository) DeleteUser(user *entity.Users) (err error) {
	log.Println("リポジトリ DeleteUser")

	if err = Db.Transaction(func(tx *gorm.DB) error {
		// データベース操作をトランザクション内で行う
		//コメント削除
		if err = tx.Where("user_id= ?", user.Id).Delete(&entity.Reviews{}).Error; err != nil {
			// エラーを返した場合はロールバックされる
			return err
		}

		if err = tx.Delete(&user).Error; err != nil {
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
func (tr *usersRepository) GetUserReviews(id *int, query *UserQuery) (reviews []entity.Reviews, err error) {
	log.Println("リポジトリ GetUserReviews")

	if err = Db.Debug().Table("reviews").Where("user_id = ?", id).Limit(query.PerPage).Offset(query.PerPage * (query.Page - 1)).Find(&reviews).Error; err != nil {
		return
	}
	//名前付き変数でreturn
	return
}
