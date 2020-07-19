package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type Todo struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Todo string `json:"todo"`
}

func main() {
	todos := []Todo{
		{1, "gorilla1", "todo1"},
		{2, "gorilla2", "todo2"},
		{3, "gorilla3", "todo3"},
		{4, "gorilla4", "todo4"},
		{5, "gorilla5", "todo5"},
		{6, "gorilla6", "todo6"},
	}

	http.Handle("/", http.FileServer(http.Dir(".")))
	http.HandleFunc("/todos", func(w http.ResponseWriter, r *http.Request) {
		flusher, _ := w.(http.Flusher)

		w.Header().Set("Content-Type", "text/event-stream")
		w.Header().Set("cache-control", "no-cache")
		w.Header().Set("Connection", "keep-alive")

		for _, todo := range todos {
			v, err := json.Marshal(todo)
			if err != nil {
				log.Println(err)
				continue
			}
			fmt.Fprintf(w, "data: %s\n\n", string(v))
			flusher.Flush()
			time.Sleep(1 * time.Second)
		}

		fmt.Fprintf(w, "data: %s\n\n", `{"status": "complete"}`)
		flusher.Flush()
		<-r.Context().Done()
		log.Println("event send done")
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
