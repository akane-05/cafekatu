package controller

import (
	"encoding/json"
	"net/http"
	"path"
	"strconv"

	"github.com/akane-05/demo-app/back-app/controller/dto"
	"github.com/akane-05/demo-app/back-app/model/entity"
	"github.com/akane-05/demo-app/back-app/model/repository")

type DemoController interface {
	GetDemos(w http.ResponseWriter, r *http.Request)
}

type demoController struct {
	dr repository.DemoRepository
}

func NewDemoController(tr repository.DemoRepository) DemoController {
	return &demoController{dr}
}

func (dc *demoController) GetDemos(w http.ResponseWriter, r *http.Request) {
	todos, err := dc.dr.GetDemos()
	if err != nil {
		w.WriteHeader(500)
		return
	}

	var demoResponses []dto.DemoResponse
	for _, v := range demos {
		demoResponses = append(demoResponses, dto.DemoResponse{Id: v.Id, Name: v.Name, PrefectureId: v.PrefectureId})	
	}

	var demoResponses dto.DemoResponse
	demosResponse.Todos = demoResponse

	output, _ := json.MarshalIndent(demosResponse.Demos, "", "\t\t")

	w.Header().Set("Content-Type", "application/json")
	w.Write(output)
}
