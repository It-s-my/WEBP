package Req

import (
	"Server/server/syst"
	"bytes"
	"encoding/json"
	"log"
	"net/http"
)

//RequestPhp - Структура для отправки данных в БД
type RequestPhp struct {
	Root      string `json:"root"`
	Size      int    `json:"size"`
	TimeSpent int    `json:"timeSpent"`
}

//Request - Формирует и отправляет post запрос в БД
func Request(info []syst.FileInfo, r *http.Request, url string, root string, elapsedTime int) {
	//Переменная для хранения полного веса директории
	var fsize int64

	//Складываем вес всех файлов внутри папки
	for _, file := range info {
		fsize += file.Bsize
	}
	//Формируем структуру
	request := RequestPhp{
		Root:      root,
		Size:      int(fsize),
		TimeSpent: elapsedTime,
	}
	//маршалим данные в json
	jsonData, err := json.Marshal(request)
	if err != nil {
		log.Printf("%v %v", err.Error())
		return
	}
	//Создается новый HTTP POST запрос с данными JSON
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("%v %v", r.URL, err.Error())
		return
	}
	//Устанавливается заголовок "Content-Type: application/json".
	req.Header.Set("Content-Type", "application/json")

	//Выполняется запрос с помощью HTTP клиента.
	client := &http.Client{}
	respPhp, err := client.Do(req)
	if err != nil {
		log.Printf("%v %v", r.URL, err.Error())

		return
	}
	defer respPhp.Body.Close()
}
