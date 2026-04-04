package main

import "errors"

// Strategy Pattern: Payment Processor

// Strategy interface
type PaymentProcessor interface {
	ProcessPayment(amount float64) error
}

// Concrete strategies
type CreditCardProcessor struct{}

func (c *CreditCardProcessor) ProcessPayment(amount float64) error {
	// Implement credit card payment processing logic here
	return nil
}

// Another concrete strategy
type PayPalProcessor struct{}

func (p *PayPalProcessor) ProcessPayment(amount float64) error {
	// Implement PayPal payment processing logic here
	return nil
}

// Context
type PaymentContext struct {
	processor PaymentProcessor
}

func (c *PaymentContext) SetPaymentProcessor(p PaymentProcessor) {
	c.processor = p
}

func (c *PaymentContext) Pay(amount float64) error {
	if c.processor == nil {
		return errors.New("payment processor not set")
	}
	return c.processor.ProcessPayment(amount)
}

// Client code
func main() {
	// Example usage
	paymentContext := &PaymentContext{}

	// Use Credit Card Processor
	paymentContext.SetPaymentProcessor(&CreditCardProcessor{})
	err := paymentContext.Pay(100.0)
	if err != nil {
		panic(err)
	}

	// Switch to PayPal Processor
	paymentContext.SetPaymentProcessor(&PayPalProcessor{})
	err = paymentContext.Pay(200.0)
	if err != nil {
		panic(err)
	}
}