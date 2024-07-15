package pref

import (
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

// MainPage отображает главную страницу сайта.
func MainPage(res http.ResponseWriter, req *http.Request) {
	templatePath := filepath.Join("static", "public", "index.html")

	ts, err := template.ParseFiles(templatePath)
	if err != nil {
		log.Println(err.Error())
		log.Println("Ошибка")
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	// Выполняем шаблон и отображаем его на странице
	err = ts.Execute(res, nil)
	if err != nil {
		log.Println(err.Error())
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

}
