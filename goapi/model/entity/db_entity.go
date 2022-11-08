package entity

import "time"

type Cafes struct {
	Id            int       `json:"id"`
	Name          string    `json:"name"  binding:"required"`
	Zipcode       string    `json:"zipcode"  binding:"required"`
	PrefectureId  int       `json:"prefecture_id"  binding:"required"`
	City          string    `json:"city"  binding:"required"`
	Street        string    `json:"street"  binding:"required"`
	BusinessHours string    `json:"business_hours"  binding:"required"`
	Approved      int       `json:"approved"`
	Deleted       int       `json:"deleted"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Users struct {
	Id             int       `json:"id" gorm:"column:id"`
	Email          string    `json:"email" binding:"required"`
	PasswordDigest string    `json:"password_digest" `
	Nickname       string    `json:"nickname" binding:"required"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Reviews struct {
	Id        int       `json:"id"`
	User_id   int       `json:"user_id"`
	Cafe_id   int       `json:"cafe_id" binding:"required"`
	Comment   string    `json:"comment" binding:"required"`
	Rating    int       `json:"rating" binding:"required"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Favorites struct {
	User_id   int       `json:"user_id"`
	Cafe_id   int       `json:"cafe_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Prefectures struct {
	Id         int       `json:"id"`
	Prefecture string    `json:"prefecture"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
