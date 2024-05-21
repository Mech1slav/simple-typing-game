package main

import (
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

var wordList = []string{
	"автомобиль", "балкон", "вода", "город", "дом", "ежедневник", "жираф", "зонт",
	"интернет", "карандаш", "лестница", "машина", "ночь", "окно", "письмо", "радио",
	"солнце", "телефон", "улыбка", "фильм", "хлеб", "цветок", "школа", "щит", "электричество",
}

func getRandomWords() []string {
	rand.Seed(time.Now().UnixNano())
	n := rand.Intn(3) + 3 // Случайное число от 3 до 5
	words := make([]string, n)
	for i := 0; i < n; i++ {
		words[i] = wordList[rand.Intn(len(wordList))]
	}
	return words
}

func main() {
	http.HandleFunc("/words", func(w http.ResponseWriter, r *http.Request) {
		randomWords := getRandomWords()
		w.Write([]byte(strings.Join(randomWords, " ")))
	})

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	log.Println("Listening on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
