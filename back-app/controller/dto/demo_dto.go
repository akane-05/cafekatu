package dto

type DemoResponse struct {
	id         int   `json:"id"`
    name       string   `json:"name"`
    prefecture_id int `json:"prefecture_id"`
    city     string `json:"city"`
    street   string `json:"street"`
    business_hours string `json:"business_hours"`
    approved      int `json:"approved"`
    deleted       int `json:"deleted"`
    created_at    string `json:"created_at"`
    updated_at    string `json:"updated_at"`
}

type DemoRequest struct {

}

type TodosResponse struct {
	Demos []DemoResponse `json:"demos"`
}