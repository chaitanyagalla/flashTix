package notifier

import "fmt"

type EmailNotifier struct {

}

func (e EmailNotifier) Send(message string) error {
	fmt.Println("sending email:", message)
	return nil
}