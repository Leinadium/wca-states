package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.SetTrustedProxies(nil)

	// routes
	api := router.Group("/api")
	api.GET("/ranking/average/:id", GetPersonRankingAverage)

	_ = router.Run()
}
