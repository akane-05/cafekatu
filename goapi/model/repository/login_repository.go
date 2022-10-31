package repository

import (
	"errors"
	"log"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/gorm"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type LoginRepository interface {
	GetUser(email *string) (user entity.UserEntity, err error)
	CheckEmail(email *string) (result bool, err error)
	InsertUser(user *entity.UserEntity) (id int, err error)
}

// 構造体の宣言
type loginRepository struct {
}

// cafesRepositoryのコンストラクタ
func NewLoginRepository() LoginRepository {
	return &loginRepository{}
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *loginRepository) GetUser(email *string) (user entity.UserEntity, err error) {
	log.Println("リポジトリ Login")

	if err = Db.Debug().Table("users").Where("email = ?", email).First(&user).Error; err != nil {
		return
	}
	//名前付き変数でreturn
	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *loginRepository) CheckEmail(email *string) (result bool, err error) {
	log.Println("リポジトリ CheckEmail")

	result = false

	var user entity.UserEntity
	if err = Db.Debug().Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			result = true
			return
		}
		return
	}
	//名前付き変数でreturn
	return
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *loginRepository) InsertUser(user *entity.UserEntity) (id int, err error) {
	log.Println("リポジトリ InsertUser")

	if err = Db.Transaction(func(tx *gorm.DB) error {
		// データベース操作をトランザクション内で行う
		if err = tx.Create(&user).Error; err != nil {
			// エラーを返した場合はロールバックされる
			return err
		}
		// nil を返すとコミットされる
		return nil
	}); err != nil {
		return
	}

	log.Println("トランザクションが正常に終了しました")
	return user.Id, nil

}
