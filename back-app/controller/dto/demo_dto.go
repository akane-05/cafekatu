package dto

type DemoResponse struct {
	Id         int   `json:"id"`
    Name       string   `json:"name"`
    PrefectureId int `json:"prefecture_id"`
    City     string `json:"city"`
    Street   string `json:"street"`
    Business_hours string `json:"business_hours"`
    Approved      int `json:"approved"`
    Deleted       int `json:"deleted"`
    CreatedAt    string `json:"created_at"`
    UpdatedAt    string `json:"updated_at"`
}

type DemoRequest struct {

}

type DemosResponse struct {
	Demos []DemoResponse `json:"demos"`
}