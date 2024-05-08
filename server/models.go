package main

import (
	"github.com/guregu/null/v5"
)

type ResultByStateRankingAverage struct {
	PersonId   string     `json:"personId" gorm:"column:personId"`
	PersonName string     `json:"personName" gorm:"column:personName"`
	EventId    string     `json:"eventId" gorm:"column:eventId"`
	StateName  string     `json:"stateName" gorm:"column:stateName"`
	Average    null.Int32 `json:"average" gorm:"column:average"`
	Ranking    int32      `json:"ranking" gorm:"column:ranking"`
}

func (ResultByStateRankingAverage) TableName() string {
	return "ResultsByStateRankingAverage"
}
