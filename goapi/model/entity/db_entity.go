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

type UserEntity struct {
	Id             int       `json:"id"`
	Email          string    `json:"email"`
	PasswordDigest string    `json:"password_digest"`
	Nickname       string    `json:"nickname"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type ReviewEntity struct {
	User_id   int       `json:"user_id"`
	Cafe_id   int       `json:"cafe_id"`
	Comment   string    `json:"comment"`
	Rating    int       `json:"rating"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type FavoriteEntity struct {
	User_id   int       `json:"user_id"`
	Cafe_id   int       `json:"cafe_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type PrefectureEntity struct {
	Id         int       `json:"id"`
	Prefecture string    `json:"prefecture"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
