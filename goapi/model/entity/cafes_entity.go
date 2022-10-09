package entity

type CafeEntity struct {
	Id            int
	Name          string
	PrefectureId  int
	City          string
	Street        string
	BusinessHours string
	Approved      int
	Deleted       int
	CreatedAt     string
	UpdatedAt     string
}

type CafeInfo struct {
	Id            int
	Name          string
	PrefectureId  int
	City          string
	Street        string
	BusinessHours string
	CreatedAt     string
	UpdatedAt     string
	Rating        int
}
