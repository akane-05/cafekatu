package repository

import (
	"fmt"
	"log"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type UsersRepository interface {
	GetUser(id *int) (user entity.Users, err error)
	GetUserFavorites(query *UserQuery) (cafeInfos []CafeInfo, err error)
	GetUserFavoTotal(query *UserQuery) (cafesTotal int64, err error)
	GetUserPastPosts(query *UserQuery) (cafeInfos []CafeInfo, err error)
	GetUserPostCafesTotal(query *UserQuery) (cafesTotal int64, err error)
	//GetFavoirtes(userId *int, cafes *[]CafeInfo) (cafeIds []int, err error)
	GetFavoirtes(userId *int) (cafeIds []int, err error)
	GetReviews(userId *int) (reviews *[]entity.Reviews, err error)
	UpdateUser(updateInfo *UpdateInfo, id *int) (user entity.Users, err error)
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

type UserQuery struct {
	PerPage int `form:"per_page" binding:"required"`
	Page    int `form:"page" binding:"required"`
	User_id int `form:"user_id" `
}

type UpdateInfo struct {
	Email    string `json:"email"`
	Password string `json:"password" binding:"required"`
	Nickname string `json:"nickname"`
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *usersRepository) GetUser(id *int) (user entity.Users, err error) {
	log.Println("リポジトリ GetUser")

	if err = Db.Debug().Table("users").Where("id = ?", id).First(&user).Error; err != nil {
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

func (tr *usersRepository) GetUserFavoTotal(query *UserQuery) (cafesTotal int64, err error) {

	where := "cafes.approved = 1"
	inquiry := fmt.Sprintf("join (select * from favorites where user_id = %v ) as userFavorites on userFavorites.cafe_id = cafes.id ", query.User_id)

	if err = Db.Debug().Model(&entity.Cafes{}).Joins(inquiry).Where(where).Count(&cafesTotal).Error; err != nil {
		return
	}

	return
}

func (tr *usersRepository) GetUserPastPosts(query *UserQuery) (cafeInfos []CafeInfo, err error) {
	log.Println("GetUserPastPosts リポジトリ")

	column := `
	cafes.id,cafes.name,
	cafes.zipcode,cafes.prefecture_id,prefectures.prefecture,cafes.city,cafes.street,
	cafes.business_hours,
	cafes.created_at,cafes.updated_at,
	AVG(reviews.rating) as rating
	`

	inquiry := fmt.Sprintf("join (select distinct user_id,cafe_id from reviews where user_id = %v ) as userReviews on userReviews.cafe_id = cafes.id ", query.User_id)

	join := `join prefectures on cafes.prefecture_id = prefectures.id left join reviews on cafes.id = reviews.cafe_id`

	where := "cafes.approved = 1"

	if err = Db.Debug().Table("cafes").Order("cafes.id").Where(where).Limit(query.PerPage).Offset(query.PerPage * (query.Page - 1)).Select(column).Joins(inquiry + join).Group("cafes.id").Find(&cafeInfos).Error; err != nil {
		return
	}

	return

}

func (tr *usersRepository) GetUserPostCafesTotal(query *UserQuery) (cafesTotal int64, err error) {

	where := "cafes.approved = 1"
	join := fmt.Sprintf("join (select distinct user_id,cafe_id from reviews where user_id = %v ) as userReviews on userReviews.cafe_id = cafes.id ", query.User_id)

	if err = Db.Debug().Model(&entity.Cafes{}).Joins(join).Where(where).Count(&cafesTotal).Error; err != nil {
		return
	}

	return
}

// func (tr *usersRepository) GetFavoirtes(userId *int, cafes *[]CafeInfo) (cafeIds []int, err error) {
func (tr *usersRepository) GetFavoirtes(userId *int) (cafeIds []int, err error) {

	// subQuery1 := Db.Where("user_id = ?", userId).Model(&entity.Favorites{})

	// var shCafes []CafeInfo = *cafes
	// var conditions []string
	// for _, cafe := range shCafes {
	// 	condition := fmt.Sprintf("cafe_id = %v", cafe.Id)
	// 	conditions = append(conditions, condition)
	// }

	// where := strings.Join(conditions, " OR ")

	// if err = Db.Debug().Table("(?) as userFavo", subQuery1).Where(where).Select("cafe_id").Find(&cafeIds).Error; err != nil {
	// 	return
	// }

	if err = Db.Debug().Table("favorites").Where("user_id = ?", userId).Select("cafe_id").Find(&cafeIds).Error; err != nil {
		return
	}

	//名前付き変数でreturn
	return
}

func (tr *usersRepository) GetReviews(userId *int) (reviews *[]entity.Reviews, err error) {

	if err = Db.Debug().Where("user_id = ?", userId).Find(&reviews).Error; err != nil {
		return
	}

	//名前付き変数でreturn
	return
}

func (tr *usersRepository) UpdateUser(updateInfo *UpdateInfo, id *int) (user entity.Users, err error) {
	log.Println("リポジトリ UpdateUser")

	if err = Db.Transaction(func(tx *gorm.DB) error {
		// データベース操作をトランザクション内で行う
		if err = Db.Model(&user).Clauses(clause.Returning{Columns: []clause.Column{{Name: "id"}, {Name: "email"}, {Name: "nickname"}}}).Where("id = ?", id).UpdateColumns(entity.Users{Email: updateInfo.Email, Nickname: updateInfo.Nickname}).Error; err != nil {
			// エラーを返した場合はロールバックされる
			return err
		}
		// nil を返すとコミットされる
		return nil
	}); err != nil {
		return
	}

	if err = Db.Debug().Table("users").Where("id = ?", id).First(&user).Error; err != nil {
		return
	}

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

		//お気に入り削除
		if err = tx.Where("user_id= ?", user.Id).Delete(&entity.Favorites{}).Error; err != nil {
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
