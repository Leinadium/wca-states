package main

import "log"

func main() {
	// connect to database
	log.Println("connecting to db")
	db, err := GetDB()
	if err != nil {
		log.Fatalln("could not connect to db", err.Error())
	}

	// fetch from db
	log.Println("fetching from db")
	wca_export_db, err := SelectExportDate(db)
	if err != nil {
		log.Fatalln("could not get export date from db", err.Error())
	}

	// get from wca
	log.Println("fetching from wca")
	wca_export_api, err := GetWcaApi()
	if err != nil {
		log.Fatalln("could not get API", err.Error())
	}

	if wca_export_db.Date == wca_export_api.ExportDate {
		log.Fatalln("no updates. Closing...")
	}

	// downloading
	log.Println("downloading...")
	err = DownloadWcaDump(wca_export_api.SqlUrl)
	if err != nil {
		log.Fatalln("could not download wca dump")
	}

	// extract
	log.Println("extracting...")
	if err := ExtractZip(); err != nil {
		log.Fatalln("could not extract zip")
	}

	// importing
	// OBS: this will not rollback if it fails!
	log.Println("importing dump...")
	if err := ImportSql(DUMP_SQL_FINAL); err != nil {
		log.Fatalln("could not import dump")
	}

	// pos processing
	// OBS: this will also not rollback if it fails!
	log.Println("running pos processing")
	if err := ImportSql(POS_PROCESSING_SQL); err != nil {
		log.Fatalln("could not import pos processing")
	}

	// cleaning
	log.Println("cleaning up")
	if err := DeleteFiles(); err != nil {
		log.Fatalln("could not delete files")
	}
}
