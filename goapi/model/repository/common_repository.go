package repository

import (
	"github.com/akane-05/cafekatu/goapi/model/entity"
	_ "github.com/go-sql-driver/mysql"
)

// DIを用いたリポジトリの実装
// インターフェースで実装すべきメソッドを決める
type CommonRepository interface {
	GetPrefectures() (prefectures []entity.Prefectures, err error)
}

// 構造体の宣言
type commonRepository struct {
}

// cafesRepositoryのコンストラクタ
func NewCommonRepository() CommonRepository {
	return &commonRepository{}
}

// ポインタレシーバ(*demoRepository)にメソッドを追加
func (tr *commonRepository) GetPrefectures() (prefectures []entity.Prefectures, err error) {

	if err = Db.Debug().Find(&prefectures).Error; err != nil {
		return
	}

	return
}
