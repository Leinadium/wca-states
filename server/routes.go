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
		var average null.Float
		if rank.EventId == "333fm" {
			average = null.NewFloat(float64(rank.Average.ValueOrZero()), rank.Average.Valid)
		} else {
			average = null.NewFloat(float64(rank.Average.ValueOrZero())/100, rank.Average.Valid)
		}
		ranks = append(ranks, rankings{
			EventId: rank.EventId,
			Ranking: rank.Ranking,
			Average: average,
		})
	}

	c.JSON(200, gin.H{
		"personName": rankingInfo[0].PersonName,
		"stateName":  rankingInfo[0].StateName,
		"rankings":   ranks,
	})
}

func GetPersonRankingSingle(c *gin.Context) {
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
	rankingInfo := []ResultByStateRankingSingle{}
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
		EventId string  `json:"eventId"`
		Ranking int32   `json:"ranking"`
		Single  float32 `json:"single"`
	}

	var ranks []rankings
	for _, rank := range rankingInfo {
		single := float32(rank.Single)
		if rank.EventId != "333fm" {
			single = single / 100.0
		}
		ranks = append(ranks, rankings{
			EventId: rank.EventId,
			Ranking: rank.Ranking,
			Single:  single,
		})
	}

	c.JSON(200, gin.H{
		"personName": rankingInfo[0].PersonName,
		"stateName":  rankingInfo[0].StateName,
		"rankings":   ranks,
	})
}

func GetPersonRankingBoth(c *gin.Context) {
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

	singleInfo := []ResultByStateRankingSingle{}
	query := db.Where("personId = ?", wca_id).Find(&singleInfo)
	if query.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "could not execute query"})
		return
	}
	if len(singleInfo) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "wca_id has no single ranking"})
		return
	}

	averageInfo := []ResultByStateRankingAverage{}
	query = db.Where("personId = ?", wca_id).Find(&averageInfo)
	if query.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "could not execute query"})
		return
	}

	// convert to desired output
	type rankingMapValue struct {
		RankingSingle  int32
		Single         float32
		RankingAverage int32
		Average        null.Float
	}
	rankingMap := make(map[string]rankingMapValue)

	for _, rank := range averageInfo {
		var average null.Float
		if rank.EventId == "333fm" {
			average = null.NewFloat(float64(rank.Average.ValueOrZero()), rank.Average.Valid)
		} else {
			average = null.NewFloat(float64(rank.Average.ValueOrZero())/100, rank.Average.Valid)
		}
		rankingMap[rank.EventId] = rankingMapValue{
			RankingAverage: rank.Ranking,
			Average:        average,
		}
	}

	for _, rank := range singleInfo {
		var single float32
		if rank.EventId == "333fm" {
			single = float32(rank.Single)
		} else {
			single = float32(rank.Single) / 100.0
		}
		// check if already created
		if _, ok := rankingMap[rank.EventId]; ok {
			rankingMap[rank.EventId] = rankingMapValue{
				RankingSingle:  rank.Ranking,
				Single:         single,
				RankingAverage: rankingMap[rank.EventId].RankingAverage,
				Average:        rankingMap[rank.EventId].Average,
			}
		} else {
			rankingMap[rank.EventId] = rankingMapValue{
				RankingSingle:  rank.Ranking,
				Single:         single,
				RankingAverage: 0,
				Average:        null.FloatFromPtr(nil),
			}
		}
	}

	type rankingsFinal struct {
		EventId        string     `json:"eventId"`
		RankingSingle  int32      `json:"rankingSingle"`
		Single         float32    `json:"single"`
		RankingAverage int32      `json:"rankingAverage"`
		Average        null.Float `json:"average"`
	}

	var rFinal []rankingsFinal
	for eventId, rank := range rankingMap {
		rFinal = append(rFinal, rankingsFinal{
			EventId:        eventId,
			RankingSingle:  rank.RankingSingle,
			Single:         rank.Single,
			RankingAverage: rank.RankingAverage,
			Average:        rank.Average,
		})
	}

	c.JSON(200, gin.H{
		"personName": singleInfo[0].PersonName,
		"stateName":  singleInfo[0].StateName,
		"rankings":   rFinal,
	})
}
