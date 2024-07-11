package req

import (
	"Server/server/syst"
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

//StatRequest - Структура для отправки данных в БД
type StatRequest struct {
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
	request := StatRequest{
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
	if respPhp.StatusCode != http.StatusOK {
		log.Printf("Сервер вернул код состояния ошибки: %v", respPhp.StatusCode)
		// Дополнительная обработка ошибки
		return
	}

	// Прочитаем тело ответа
	body, err := ioutil.ReadAll(respPhp.Body)
	if err != nil {
		log.Printf("Ошибка чтения тела ответа.: %v", err)
		return
	}

	// Проверяем ответ от сервера PHP
	var response map[string]interface{}
	err = json.Unmarshal(body, &response)
	if err != nil {
		log.Printf("Ошибка при демаршалинге тела ответа.: %v", err)
		return
	}
}
