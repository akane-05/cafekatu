package entity

import "time"

type CafeEntity struct {
	Id            int       `json:"id"`
	Name          string    `json:"name"`
	Zipcode       string    `json:"zipcode"`
	PrefectureId  int       `json:"prefecture_id"`
	City          string    `json:"city"`
	Street        string    `json:"street"`
	BusinessHours string    `json:"business_hours"`
	Approved      int       `json:"approved"`
	Deleted       int       `json:"deleted"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	DeletedAt     time.Time `json:"deleted_at"`
}
