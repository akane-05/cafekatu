package entity

import (
	"github.com/akane-05/cafekatu/goapi/controller/dto"
	"gorm.io/gorm"
)

type CafeEntity struct {
	gorm.Model
	Name          string
	Zipcode       string
	PrefectureId  int
	City          string
	Street        string
	BusinessHours string
	Approved      int
	Deleted       int
}

func ToEntity(cafeRequest dto.CafeRequest) CafeEntity {
	return CafeEntity{
		Name:          cafeRequest.Name,
		Zipcode:       cafeRequest.Zipcode,
		PrefectureId:  cafeRequest.PrefectureId,
		City:          cafeRequest.City,
		Street:        cafeRequest.Street,
		BusinessHours: cafeRequest.BusinessHours,
	}
}
