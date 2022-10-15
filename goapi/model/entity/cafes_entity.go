package entity

import "github.com/akane-05/cafekatu/goapi/controller/dto"

type CafeInfo struct {
	Id            int
	Name          string
	Zipcode       string
	PrefectureId  int
	City          string
	Street        string
	BusinessHours string
	CreatedAt     string
	UpdatedAt     string
	Rating        int
}

func (cafeInfo CafeInfo) ToDto() dto.CafeResponse {
	return dto.CafeResponse{
		Id:            cafeInfo.Id,
		Name:          cafeInfo.Name,
		Zipcode:       cafeInfo.Zipcode,
		PrefectureId:  cafeInfo.PrefectureId,
		City:          cafeInfo.City,
		Street:        cafeInfo.Street,
		BusinessHours: cafeInfo.BusinessHours,
		CreatedAt:     cafeInfo.CreatedAt,
		UpdatedAt:     cafeInfo.UpdatedAt,
	}
}
