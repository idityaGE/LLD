package builder

import (
	"errors"
	"fmt"
	"net/mail"
	"strings"
)

const (
	minPriority = 1
	maxPriority = 5
	defaultPrio = 3
)

type Email struct {
	to          []string
	cc          []string
	bcc         []string
	subject     string
	body        string
	attachments []string
	priority    int
}

// Getters for the Email product

func (e *Email) To() []string          { return append([]string(nil), e.to...) }
func (e *Email) Cc() []string          { return append([]string(nil), e.cc...) }
func (e *Email) Bcc() []string         { return append([]string(nil), e.bcc...) }
func (e *Email) Subject() string       { return e.subject }
func (e *Email) Body() string          { return e.body }
func (e *Email) Attachments() []string { return append([]string(nil), e.attachments...) }
func (e *Email) Priority() int         { return e.priority }

func (e *Email) Send() {
	fmt.Printf("Sending email to: %v\n", e.to)
	fmt.Printf("CC: %v\n", e.cc)
	fmt.Printf("BCC: %v\n", e.bcc)
	fmt.Printf("Subject: %s\n", e.subject)
	fmt.Printf("Body: %s\n", e.body)
	fmt.Printf("Attachments: %v\n", e.attachments)
	fmt.Printf("Priority: %d\n", e.priority)
}

type EmailBuilder struct {
	to          []string
	cc          []string
	bcc         []string
	subject     string
	body        string
	attachments []string
	priority    int
}

func NewEmailBuilder() *EmailBuilder {
	return &EmailBuilder{priority: defaultPrio}
}

func (b *EmailBuilder) To(to ...string) *EmailBuilder {
	b.to = append(b.to, to...)
	return b
}

func (b *EmailBuilder) Cc(cc ...string) *EmailBuilder {
	b.cc = append(b.cc, cc...)
	return b
}

func (b *EmailBuilder) Bcc(bcc ...string) *EmailBuilder {
	b.bcc = append(b.bcc, bcc...)
	return b
}

func (b *EmailBuilder) Subject(subject string) *EmailBuilder {
	b.subject = subject
	return b
}

func (b *EmailBuilder) Body(body string) *EmailBuilder {
	b.body = body
	return b
}

func (b *EmailBuilder) Attachments(attachments ...string) *EmailBuilder {
	b.attachments = append(b.attachments, attachments...)
	return b
}

func (b *EmailBuilder) Priority(priority int) *EmailBuilder {
	if priority < minPriority {
		priority = minPriority
	}
	if priority > maxPriority {
		priority = maxPriority
	}
	b.priority = priority
	return b
}

func (b *EmailBuilder) Build() (*Email, error) {
	if err := b.validate(); err != nil {
		return nil, err
	}

	result := &Email{
		to:          append([]string(nil), b.to...),
		cc:          append([]string(nil), b.cc...),
		bcc:         append([]string(nil), b.bcc...),
		subject:     strings.TrimSpace(b.subject),
		body:        strings.TrimSpace(b.body),
		attachments: append([]string(nil), b.attachments...),
		priority:    b.priority,
	}

	// Reset builder state after successful build
	b.to = nil
	b.cc = nil
	b.bcc = nil
	b.subject = ""
	b.body = ""
	b.attachments = nil
	b.priority = defaultPrio

	return result, nil
}

func (b *EmailBuilder) validate() error {
	if len(b.to) == 0 {
		return errors.New("email requires at least one recipient")
	}

	if err := validateAddresses(b.to); err != nil {
		return fmt.Errorf("invalid 'to' address: %w", err)
	}

	if err := validateAddresses(b.cc); err != nil {
		return fmt.Errorf("invalid 'cc' address: %w", err)
	}

	if err := validateAddresses(b.bcc); err != nil {
		return fmt.Errorf("invalid 'bcc' address: %w", err)
	}

	if strings.TrimSpace(b.subject) == "" {
		return errors.New("email subject cannot be empty")
	}

	if strings.TrimSpace(b.body) == "" {
		return errors.New("email body cannot be empty")
	}

	if b.priority < minPriority || b.priority > maxPriority {
		return fmt.Errorf("email priority must be between %d and %d", minPriority, maxPriority)
	}

	return nil
}

func validateAddresses(addrs []string) error {
	for _, addr := range addrs {
		if _, err := mail.ParseAddress(addr); err != nil {
			return fmt.Errorf("%q is not a valid email: %w", addr, err)
		}
	}
	return nil
}
