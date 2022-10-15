package entity

import (
	"gorm.io/gorm"
)

type CafesEntity struct {
	gorm.Model
	Name          string
	PrefectureId  int
	City          string
	Street        string
	BusinessHours string
	Approved      int
	Deleted       int
}
