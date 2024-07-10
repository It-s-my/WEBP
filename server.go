package main

import (
	"Server/server/Run"
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
)

// main - точка входа в программу
func main() {
	// Добавляем сигналы syscall.SIGINT и syscall.SIGTERM к контексту
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	err := Run.RunServer(ctx)
	if err != nil {
		fmt.Errorf("Ошибка запуска сервера: %v")
		return
	}
}
