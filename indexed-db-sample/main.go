package main

import (
	"io"
	"log"
	"net/http"
	"os"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir(".")))
	http.HandleFunc("/file", func(w http.ResponseWriter, r *http.Request) {
		file, err := os.Open("sample.txt")
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		defer file.Close()

		io.Copy(w, file)
	})
	log.Println("start http server :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
