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
	GetUser(id *int) (user entity.UserEntity, err error)
	InsertUser(user *entity.UserEntity) (err error)
	UpdateUser(user *entity.UserEntity) (err error)
	DeleteUser(user *entity.UserEntity) (err error)
}

// 構造体の宣言
type usersRepository struct {
}

// cafesRepositoryのコンストラクタ
func NewUsersRepository() UsersRepository {
	return &usersRepository{}
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *usersRepository) GetUser(id *int) (user entity.UserEntity, err error) {
	log.Println("リポジトリ GetUser")

	if err = Db.Debug().Table("users").Where("id = ?", id).First(&user).Error; err != nil {
		return
	}
	//名前付き変数でreturn
	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *usersRepository) InsertUser(user *entity.UserEntity) (err error) {
	log.Println("リポジトリ InsertCafe")

	// if err = Db.Transaction(func(tx *gorm.DB) error {
	// 	// データベース操作をトランザクション内で行う
	// 	if err = tx.Create(&cafe).Error; err != nil {
	// 		// エラーを返した場合はロールバックされる
	// 		return err
	// 	}
	// 	// nil を返すとコミットされる
	// 	return nil
	// }); err != nil {
	// 	return
	// }

	// log.Println("トランザクションが正常に終了しました")
	return

}

func (tr *usersRepository) UpdateUser(user *entity.UserEntity) (err error) {
	log.Println("リポジトリ UpdateUser")

	// if err = Db.Transaction(func(tx *gorm.DB) error {
	// 	// データベース操作をトランザクション内で行う
	// 	if err = tx.Create(&favo).Error; err != nil {
	// 		// エラーを返した場合はロールバックされる
	// 		return err
	// 	}
	// 	// nil を返すとコミットされる
	// 	return nil
	// }); err != nil {
	// 	return
	// }

	// log.Println("トランザクションが正常に終了しました")
	return

}

func (tr *usersRepository) DeleteUser(user *entity.UserEntity) (err error) {
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
