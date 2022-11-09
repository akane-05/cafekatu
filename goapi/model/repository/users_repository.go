package repository

import (
	"log"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type UsersRepository interface {
	GetUser(id *int) (user entity.Users, err error)
	UpdateUser(patchUserInfo PatchUserInfo) (err error)
	DeleteUser(user *entity.Users) (err error)
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

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *usersRepository) GetUser(id *int) (user entity.Users, err error) {
	log.Println("リポジトリ GetUser")

	if err = Db.Debug().Table("users").Where("email = ?", id).First(&user).Error; err != nil {
		return
	}
	//名前付き変数でreturn
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
		if err = tx.Delete(&user).Error; err != nil {
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
