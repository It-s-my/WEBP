package pref

import (
	"html/template"
	"log"
	"net/http"
)

// MainPage отображает главную страницу сайта.
func MainPage(res http.ResponseWriter, req *http.Request) {
	// Парсим шаблон страницы index.html
	ts, err := template.ParseFiles("static/index.html")
	if err != nil {
		log.Println(err.Error())
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
