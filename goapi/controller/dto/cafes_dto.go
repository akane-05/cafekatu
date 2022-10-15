package dto

type CafeResponse struct {
	Id            int    `json:"id"`
	Name          string `json:"name"`
	PrefectureId  int    `json:"prefecture_id"`
	City          string `json:"city"`
	Street        string `json:"street"`
	BusinessHours string `json:"business_hours"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
	Rating        int    `json:"rating"`
}

type CafesResponse struct {
	Cafes []CafeResponse `json:"cafes"`
}
