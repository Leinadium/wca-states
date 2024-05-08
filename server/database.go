package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

func GetDB() (*gorm.DB, error) {
	if db == nil {
		new_db, err := gorm.Open(mysql.Open(os.Getenv("GORM_DSN")), &gorm.Config{})
		if err == nil {
			db = new_db
			return db, nil
		} else {
			return nil, err
		}
	}
	return db, nil
}

func GetDbOrSetError(c *gin.Context) *gorm.DB {
	db, err := GetDB()
	if err != nil {
		c.JSON(500, gin.H{
			"message": "Error connecting to database",
		})
		return nil
	}
	return db
}
