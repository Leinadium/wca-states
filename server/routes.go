package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/guregu/null/v5"
)

func GetPersonRankingAverage(c *gin.Context) {
	// geting param
	wca_id := c.Param("id")
	if wca_id == "" {
		c.JSON(400, gin.H{"error": "no wca id"})
		return
	}

	// get db
	db := GetDbOrSetError(c)
	if db == nil {
		return
	}

	// query
	rankingInfo := []ResultByStateRankingAverage{}
	query := db.Where("personId = ?", wca_id).Find(&rankingInfo)
	if query.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "could not execute query"})
		return
	}
	if len(rankingInfo) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "wca_id not found"})
		return
	}

	// convert to desired output
	type rankings struct {
		EventId string     `json:"eventId"`
		Ranking int32      `json:"ranking"`
		Average null.Float `json:"average"`
	}

	var ranks []rankings
	for _, rank := range rankingInfo {
		ranks = append(ranks, rankings{
			EventId: rank.EventId,
			Ranking: rank.Ranking,
			Average: null.NewFloat(float64(rank.Average.ValueOrZero())/100, rank.Average.Valid),
		})
	}

	c.JSON(200, gin.H{
		"personName": rankingInfo[0].PersonName,
		"stateName":  rankingInfo[0].StateName,
		"rankings":   ranks,
	})
}
