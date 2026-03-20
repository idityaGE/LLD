package main

import (
	"fmt"
	"log"

	"github.com/idityaGE/LLD/patterns/builder"
)

func main() {
	emailBuilder := builder.NewEmailBuilder()

	email, err := emailBuilder.
		To("user1@example.com").
		To("mail@example.com").
		Cc("user2@example.com").
		Subject("Hello, World!").
		Body("This is a simple email.").
		Priority(1).
		Build()
	if err != nil {
		log.Fatalf("failed to build email: %v", err)
	}

	fmt.Println(email.To())
	fmt.Println(email.Subject())
	email.Send()

	email2, err := emailBuilder.
		To("kill@gmail.com").
		To("user3@example.com").
		Subject("Hello, World!").
		Body("This is another simple email.").
		Priority(2).
		Build()
	if err != nil {
		log.Fatalf("failed to build second email: %v", err)
	}

	fmt.Println(email2.To())
	fmt.Println(email2.Subject())
	email2.Send()
}
