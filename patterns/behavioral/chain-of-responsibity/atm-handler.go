package main

import "fmt"

// ─── Request ───────────────────────────────────────────────────────────────

type CashRequest struct {
	Amount int
}

// ─── Interface ─────────────────────────────────────────────────────────────

type CashHandler interface {
	SetNext(next CashHandler) CashHandler
	Dispense(request *CashRequest)
}

// ─── Base Handler ──────────────────────────────────────────────────────────

type BaseCashHandler struct {
	next         CashHandler
	denomination int
}

func (b *BaseCashHandler) SetNext(next CashHandler) CashHandler {
	b.next = next
	return next
}

func (b *BaseCashHandler) Dispense(request *CashRequest) {
	if request.Amount >= b.denomination {
		noteCount := request.Amount / b.denomination
		request.Amount = request.Amount % b.denomination
		fmt.Printf("Dispensing %d x $%d\n", noteCount, b.denomination)
	}
	if b.next != nil {
		b.next.Dispense(request)
	}
}

// ─── Concrete Handlers ─────────────────────────────────────────────────────

// Go has no inheritance, so each handler embeds BaseCashHandler
// and sets its denomination in a constructor function.

type (
	HundredDollarHandler struct{ BaseCashHandler }
	FiftyDollarHandler   struct{ BaseCashHandler }
	TwentyDollarHandler  struct{ BaseCashHandler }
	TenDollarHandler     struct{ BaseCashHandler }
)

func NewHundredDollarHandler() *HundredDollarHandler {
	return &HundredDollarHandler{BaseCashHandler{denomination: 100}}
}

func NewFiftyDollarHandler() *FiftyDollarHandler {
	return &FiftyDollarHandler{BaseCashHandler{denomination: 50}}
}

func NewTwentyDollarHandler() *TwentyDollarHandler {
	return &TwentyDollarHandler{BaseCashHandler{denomination: 20}}
}

func NewTenDollarHandler() *TenDollarHandler {
	return &TenDollarHandler{BaseCashHandler{denomination: 10}}
}

// ─── Main ──────────────────────────────────────────────────────────────────

func main() {
	hundreds := NewHundredDollarHandler()
	fifties := NewFiftyDollarHandler()
	twenties := NewTwentyDollarHandler()
	tens := NewTenDollarHandler()

	hundreds.SetNext(fifties).SetNext(twenties).SetNext(tens)

	fmt.Println("--- Withdrawing $380 ---")
	req1 := &CashRequest{Amount: 380}
	hundreds.Dispense(req1)
	fmt.Printf("Remaining: $%d\n", req1.Amount)

	fmt.Println("\n--- Withdrawing $275 ---")
	req2 := &CashRequest{Amount: 275}
	hundreds.Dispense(req2)
	fmt.Printf("Remaining: $%d\n", req2.Amount)
}
