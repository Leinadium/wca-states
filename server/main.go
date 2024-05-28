package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.SetTrustedProxies(nil)

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://ranking-estadual-wca.leinadium.dev", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	// routes
	api := router.Group("/api")
	api.GET("/person/both/:id", GetPersonRankingBoth)
	api.GET("/person/average/:id", GetPersonRankingAverage)
	api.GET("/person/single/:id", GetPersonRankingSingle)

	_ = router.Run()
}
