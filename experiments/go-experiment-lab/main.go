package main

import (
		"encoding/json"
		"net/http"
 		"fmt"
		"os"
		"flashtix/go-request-lab/notifier"
	)

func getPort() string {
	port := os.Getenv("PORT")

	if port == "" {
		return "5001"
	}
	return port
}

type HealthResponse struct {
	Status string `json:"status"`
	Service string `json:"service"`
}

func healthHandler (w http.ResponseWriter, r *http.Request) {
		// w.Write([]byte("Go server is healthy"))
		if r.Method != http.MethodGet {
			http.Error(
				w,
				"method not allowed",
				http.StatusMethodNotAllowed,
			)
			return
		}

		response := HealthResponse {
			Status: "ok",
			Service: "go-request-lab",
		}

		w.Header().Set("Content-Type", "application/json")
		err := json.NewEncoder(w).Encode(response)

		if err != nil{
			fmt.Println("server Failed", err)
		}
		
	}

type ServicesResponse struct {
	Services []string `json:"services"`
}
type Service struct{
	Name string
	Port int
}

func (a Service) Address() string {
	return fmt.Sprintf(":%d", a.Port)
}

func (a *Service) ChangePort(port int) {
	a.Port = port
}

func serviceHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
			http.Error(
				w,
				"method not allowed",
				http.StatusMethodNotAllowed,
			)
			return
		}

	services := []string {
		"auth",
		"payment",
		"inventory",
	}

	response := ServicesResponse {
		Services: services,
	}

	w.Header().Set("Content-Type", "application/json")

	err := json.NewEncoder(w).Encode(response)

	if err != nil {
		fmt.Println("server Error", err)
	}

} 

func ChangeVal(value *int) {
	// *value = 100
	*value = 100
}

type Notifier interface {
	Send(message string) error
}

type SmsNotifier struct{

}
func (s SmsNotifier) Send(message string) error {
	fmt.Println("sending Sms:", message)
	return nil
}
func SendNotifiction(notifier Notifier, message string) {
	err:= notifier.Send(message)

	if err != nil {
		fmt.Println("notification failed:", err)
	}
}


func main() {
	port := getPort()

	ports := map[string]int {
		"auth": 4000,
		"inventory": 4001, 
	}

	number := 10;
	
	fmt.Println("before:", number)

	ChangeVal(&number)
	// ChangeVal(&number)

	fmt.Println("After", number)

	value, ok := ports["order"]

	if !ok {
		fmt.Println("port:", value )
		fmt.Println("exists: ", ok)
	}

	service := Service{
		Name: "Auth",
		Port: 6060,
	}	

	fmt.Println(service.Address())

	service.ChangePort(5050)

	fmt.Println("Changed port:",service.Address())

	emailNotifier := notifier.EmailNotifier{}
	
	SendNotifiction(emailNotifier, "order")

	smsNotifier := SmsNotifier{}

	SendNotifiction(smsNotifier, "heelo");

	// fmt.Println("go is running")
	http.HandleFunc("/health", healthHandler)
	http.HandleFunc("/services", serviceHandler)

	address := ":" + port  

	err := http.ListenAndServe(address, nil)

	if err != nil {
		fmt.Println("server failed", err)
	}
}