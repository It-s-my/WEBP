package upserver

import (
	"Server/server/pref"
	"Server/server/req"
	"Server/server/syst"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

const shutdownTimeout = 3 * time.Second
const statusBadRequest = 400
const statusInternalServerError = 500
const statusOK = 200

// Config структура для хранения данных из конфига
type Config struct {
	Port       int    `json:"port"`           //хранит порт для запуска сервера
	Root       string `json:"root"`           //хранит начальный путь
	UrlPhp     string `json:"urlForPhp"`      //хранит ссылку на php файл
	PortPhp    int    `json:"PortForPhp"`     //хранит порт для запуска сервера php
	PathForPhp string `json:"FilePathForPhp"` //хранит название файла php
}

//Response структура для хранения статуса,ошибки,файлов и пути
type Response struct {
	Status int             `json:"Status"` //статус ошибки
	Error  string          `json:"Error"`  //ошибка
	Files  []syst.FileInfo `json:"Files"`  //размер файла
	Root   string          `json:"root"`   //путь файла
}

var config *Config

func ExportConf(file string) error {
	data, err := os.ReadFile(file)
	if err != nil {
		return err
	}

	var conf Config
	err = json.Unmarshal(data, &conf)
	if err != nil {
		return err
	}
	config = &conf
	return nil
}

// HandleFileSort - обрабатывает HTTP запросы на сервере.
func HandleFileSort(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	// Читаем конфигурацию из файла

	//Записываем ссылку на php файл
	url := fmt.Sprintf("%s:%v%v", config.UrlPhp, config.PortPhp, config.PathForPhp)

	// Получаем значения параметров "root" и "sort" из URL запроса
	root := r.URL.Query().Get("root")
	if root == "" {
		root = config.Root
	} else {
		root = r.URL.Query().Get("root")
	}
	fmt.Printf("ROOT:", root)
	sortM := r.URL.Query().Get("sort")

	// Вызываем функцию GetFilesList из пакета syst для сортировки файлов
	data, err := syst.GetFilesList(root, sortM)
	if err != nil {
		resp, marshalErr := json.Marshal(Response{
			Status: statusBadRequest,
			Error:  err.Error(),
			Files:  nil,
			Root:   root,
		})
		if marshalErr != nil {
			// Обработка ошибки при маршалинге JSON
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("500"))
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		w.Write(resp)
		return
	}

	// Преобразуем данные в формат JSON
	resp, err := json.Marshal(data)
	// Если произошла ошибка при маршалинге данных, логируем ошибку и отправляем HTTP ошибку
	if err != nil {

		resp, marshalErr := json.Marshal(Response{
			Status: statusInternalServerError,
			Error:  err.Error(),
			Files:  nil,
			Root:   root,
		})
		if marshalErr != nil {
			// Обработка ошибки при маршалинге JSON
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("500"))
			return
		}
		w.Write(resp)
		return
	}
	//Записываем время в переменную
	elapsed := time.Since(start)

	//Вызываем фукнцию
	go req.Request(data, r, url, root, int(elapsed.Milliseconds()))

	// Устанавливаем заголовок Content-Type как application/json
	w.Header().Set("Content-Type", "application/json")
	// Устанавливаем статус код HTTP ответа на 200 OK
	resp, marshalErr := json.Marshal(Response{
		Status: statusOK,
		Error:  "",
		Files:  data,
		Root:   root,
	})
	if marshalErr != nil {
		// Обработка ошибки при маршалинге JSON
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("500"))
		return
	}
	w.WriteHeader(http.StatusOK)
	// Отправляем ответ клиенту
	w.Write(resp)
}

//RunServer - Запускает сервер
func RunServer(ctx context.Context) error {
	// Построение кросс-платформенного пути к файлу
	configPath := filepath.Join("server", "config", "config.json")

	file, err := os.Open(configPath)
	if err != nil {
		fmt.Println("Ошибка открытия файла:", err)
		return err
	}
	defer func() {
		if err := file.Close(); err != nil {
			fmt.Println("Ошибка при закрытии файла:", err)
		}
	}()

	// Декодируем данные из файла в структуру Config
	err = json.NewDecoder(file).Decode(&config)
	if err != nil {
		fmt.Println("Ошибка декодирования данных:", err)
	}
	// Создаем HTTP сервер с настройками из конфигурации
	mux := http.NewServeMux()
	mux.HandleFunc("/fs", HandleFileSort)
	mux.HandleFunc("/", pref.MainPage)

	mux.HandleFunc("/bundle.js", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "bundle.js")
	})

	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", config.Port),
		Handler: mux,
	}
	// Запускаем HTTP сервер асинхронно в горутине
	go func() {
		fmt.Println("Сервер успешно запущен на порту", config.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Не удалось запустить сервер на порту %d: %v\n", config.Port, err)
		}
	}()
	<-ctx.Done()
	fmt.Println("\nОстанавливаю сервер...")

	// Останавливаем сервер с учетом контекста
	ctxShutdown, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()

	err = server.Shutdown(ctxShutdown)
	if err != nil {
		return fmt.Errorf("shutdown: %v", err)
	}

	fmt.Println("Сервер остановлен корректно.")

	return err
}
