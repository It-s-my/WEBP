package main

import (
	"Server/pref"
	"Server/syst"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

const shutdownTimeout = 3 * time.Second

// Config структура для хранения порта
type Config struct {
	Port int    `json:"port"`
	Root string `json:"root"`
}

type Response struct {
	Status int             `json:"Status"`
	Error  string          `json:"Error"`
	Files  []syst.FileInfo `json:"Files"`
}

var config Config

// HandleFileSort - обрабатывает HTTP запросы на сервере.
func HandleFileSort(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-Content-Type-Options", "nosniff")

	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Получаем значения параметров "root" и "sort" из URL запроса
	root := config.Root + r.URL.Query().Get("root")
	sortM := r.URL.Query().Get("sort")

	// Вызываем функцию GetFailesList из пакета syst для сортировки файлов
	data, err := syst.GetFailesList(root, sortM)
	if err != nil {
		resp, _ := json.Marshal(Response{
			Status: 400,
			Error:  "Ошибка.",
			Files:  nil,
		})
		w.WriteHeader(http.StatusBadRequest)

		w.Write(resp)
		return
	}
	// Преобразуем данные в формат JSON
	resp, err := json.Marshal(data)
	// Если произошла ошибка при маршалинге данных, логируем ошибку и отправляем HTTP ошибку
	if err != nil {

		resp, _ := json.Marshal(Response{
			Status: 500,
			Error:  "Ошибка.",
			Files:  nil,
		})
		w.WriteHeader(http.StatusBadRequest)

		w.Write(resp)
		return
	}

	// Устанавливаем заголовок Content-Type как application/json
	w.Header().Set("Content-Type", "application/json")
	// Устанавливаем статус код HTTP ответа на 200 OK
	resp, _ = json.Marshal(Response{
		Status: 200,
		Error:  "",
		Files:  data,
	})
	w.WriteHeader(http.StatusOK)
	// Отправляем ответ клиенту
	w.Write(resp)
}

func RunServer(ctx context.Context) error {
	// Читаем конфигурацию из файла
	file, err := os.Open("config/config.json")
	if err != nil {
		fmt.Println("Ошибка открытия файла", err)
	}
	defer file.Close()

	// config - переменная для хранения конфигурации

	// Декодируем данные из файла в структуру Config
	err = json.NewDecoder(file).Decode(&config)
	if err != nil {
		fmt.Println("Ошибка декодирования данных:", err)
	}
	// Создаем HTTP сервер с настройками из конфигурации
	mux := http.NewServeMux()
	mux.HandleFunc("/", HandleFileSort)
	mux.HandleFunc("/fs", pref.MainPage)

	fileServer := http.FileServer(http.Dir("../static"))
	mux.Handle("/static/", http.StripPrefix("/static", fileServer))
	mux.HandleFunc("../static/css/MainStyle.css", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/css")
		http.ServeFile(w, r, "../static")
	})
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", config.Port),
		Handler: mux,
	}
	// Запускаем HTTP сервер асинхронно в горутине
	go func() {
		fmt.Println("Пытаюсь запустить сервер на порту", config.Port)
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

// main - точка входа в программу
func main() {
	// Добавляем сигналы syscall.SIGINT и syscall.SIGTERM к контексту
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	err := RunServer(ctx)
	if err != nil {
		fmt.Errorf("Ошибка запуска сервера: %v")
		return
	}
}
