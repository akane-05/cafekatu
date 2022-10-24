package repository

import (
	"log"

	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type LoginRepository interface {
	Login(id *int) (user entity.UserEntity, err error)
}

// 構造体の宣言
type loginRepository struct {
}

// cafesRepositoryのコンストラクタ
func NewLoginRepository() LoginRepository {
	return &loginRepository{}
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *loginRepository) Login(id *int) (user entity.UserEntity, err error) {
	log.Println("リポジトリ Login")

	if err = Db.Debug().Table("users").Where("id = ?", id).First(&user).Error; err != nil {
		return
	}
	//名前付き変数でreturn
	return
}
