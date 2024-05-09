package main

import (
	"archive/zip"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

const WCA_EXPORT_PUBLIC = "https://www.worldcubeassociation.org/api/v0/export/public"
const DUMP_SQL_ZIP = "./wca_dump.sql.zip"
const DUMP_SQL_FINAL = "./wca_dump.sql"
const POS_PROCESSING_SQL = "./pos_processing.sql"

var MYSQL_USER = os.Getenv("MYSQL_USER")
var MYSQL_PASSWORD = os.Getenv("MYSQL_PASSWORD")
var MYSQL_HOST = os.Getenv("MYSQL_HOST")
var MYSQL_PORT = os.Getenv("MYSQL_PORT")
var MYSQL_DATABASE = os.Getenv("MYSQL_DATABASE")

func GetDB() (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		MYSQL_USER,
		MYSQL_PASSWORD,
		MYSQL_HOST,
		MYSQL_PORT,
		MYSQL_DATABASE,
	)
	return gorm.Open(
		mysql.Open(dsn), &gorm.Config{},
	)
}

func SelectExportDate(db *gorm.DB) (WCAExportDb, error) {
	var ret WCAExportDb
	query := db.First(&ret)
	if query.Error != nil {
		// allow record not found
		if errors.Is(query.Error, gorm.ErrRecordNotFound) {
			return ret, nil
		}
		return ret, query.Error
	}
	return ret, nil
}

func GetWcaApi() (WCAExportApiResponse, error) {
	// request from api
	var ret WCAExportApiResponse

	r, err := http.Get(WCA_EXPORT_PUBLIC)
	if err != nil {
		println("Error", err.Error())
	}
	defer r.Body.Close()

	if r.StatusCode != 200 {
		return ret, errors.New("status code not 200")
	}

	err = json.NewDecoder(r.Body).Decode(&ret)
	return ret, err
}

func DownloadWcaDump(url string) error {
	// create
	file, err := os.Create(DUMP_SQL_ZIP)
	if err != nil {
		return err
	}
	defer file.Close()

	// get
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// store
	if _, err = io.Copy(file, resp.Body); err != nil {
		return err
	}
	return nil
}

func ExtractZip() error {
	r, err := zip.OpenReader(DUMP_SQL_ZIP)
	if err != nil {
		return err
	}
	defer r.Close()

	// iterate over files
	done := false
	for _, f := range r.File {
		rc, err := f.Open()
		if err != nil {
			return err
		}
		defer rc.Close()

		if strings.HasSuffix(f.Name, ".sql") {
			log.Println("found sql file", f.Name)
			uncFile, err := os.Create(DUMP_SQL_FINAL)
			if err != nil {
				return err
			}
			_, err = io.Copy(uncFile, rc)
			if err != nil {
				return err
			}
			done = true
			break
		}
	}
	if !done {
		return errors.New("sql not found")
	}
	return nil
}

func DeleteFiles() error {
	if err := os.Remove(DUMP_SQL_ZIP); err != nil {
		return err
	}
	if err := os.Remove(DUMP_SQL_FINAL); err != nil {
		return err
	}
	return nil
}

func ImportSql(filename string) error {
	cmd := exec.Command(
		"mysql",
		"--host", MYSQL_HOST,
		"--port", MYSQL_PORT,
		"--user", MYSQL_USER,
		"-p"+MYSQL_PASSWORD,
		MYSQL_DATABASE,
		"-e", "source "+filename,
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

type WCAExportApiResponse struct {
	ExportDate string `json:"export_date"`
	SqlUrl     string `json:"sql_url"`
	TsvUrl     string `json:"eventId"`
}

type WCAExportDb struct {
	Date string `gorm:"column:exportDate"`
}

func (WCAExportDb) TableName() string {
	return "WCAExportDate"
}
