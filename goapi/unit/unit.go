package unit

import (
	"math/rand"

	"github.com/akane-05/cafekatu/goapi/model/entity"
)

func Include(slice []int, target int) bool {
	for _, num := range slice {
		if num == target {
			return true
		}
	}
	return false
}

func ExReviews(reviews *[]entity.Reviews, target int) []entity.Reviews {
	var exReviews []entity.Reviews
	for _, review := range *reviews {
		if review.Cafe_id == target {
			exReviews = append(exReviews, review)
		}
	}
	return exReviews
}

func RandomString() string {
	num := 10
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	s := make([]rune, num)
	for i := range s {
		s[i] = letters[rand.Intn(len(letters))]
	}
	return string(s)
}
