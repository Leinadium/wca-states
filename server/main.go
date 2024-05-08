package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.SetTrustedProxies(nil)

	// routes
	router.GET("/person/:id", GetPersonRanking)

	_ = router.Run()
}
