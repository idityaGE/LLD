package main

import "fmt"

type OrganizationComponent interface {
	GetName() string
	Print(indentation string)
	GetSalary() float64
	GetTitle() string
}

type Employee struct {
	Name   string
	Title  string
	Salary float64
}

func NewEmployee(name, title string, salary float64) *Employee {
	return &Employee{
		Name:   name,
		Title:  title,
		Salary: salary,
	}
}

func (e *Employee) GetName() string {
	return e.Name
}

func (e *Employee) Print(indentation string) {
	fmt.Printf("%s- %s (%s): $%.2f\n", indentation, e.Name, e.Title, e.Salary)
}

func (e *Employee) GetSalary() float64 {
	return e.Salary
}

func (e *Employee) GetTitle() string {
	return e.Title
}

type Manager struct {
	Name         string
	Title        string
	Salary       float64
	Subordinates []OrganizationComponent
}

func NewManager(name, title string, salary float64) *Manager {
	return &Manager{
		Name:         name,
		Title:        title,
		Salary:       salary,
		Subordinates: []OrganizationComponent{},
	}
}

func (m *Manager) GetName() string {
	return m.Name
}

func (m *Manager) Print(indentation string) {
	fmt.Printf("%s+ %s (%s): $%.2f\n", indentation, m.Name, m.Title, m.Salary)
	for _, subordinate := range m.Subordinates {
		subordinate.Print(indentation + "  ")
	}
}

func (m *Manager) GetSalary() float64 {
	return m.Salary
}

func (m *Manager) GetTitle() string {
	return m.Title
}

func (m *Manager) AddSubordinate(subordinate OrganizationComponent) {
	m.Subordinates = append(m.Subordinates, subordinate)
}

func (m *Manager) RemoveSubordinate(subordinate OrganizationComponent) {
	for i, s := range m.Subordinates {
		if s.GetName() == subordinate.GetName() {
			m.Subordinates = append(m.Subordinates[:i], m.Subordinates[i+1:]...)
			return
		}
	}
}


// Usage example

func main() {
	ceo := NewManager("Alice", "CEO", 200000)
	cto := NewManager("Bob", "CTO", 150000)
	dev1 := NewEmployee("Charlie", "Developer", 80000)
	dev2 := NewEmployee("Dave", "Developer", 80000)
	
	ceo.AddSubordinate(cto)
	cto.AddSubordinate(dev1)
	cto.AddSubordinate(dev2)
	ceo.Print("")

	designManager := NewManager("Eve", "Design Manager", 120000)
	designer1 := NewEmployee("Frank", "Designer", 70000)
	designer2 := NewEmployee("Grace", "Designer", 70000)

	designManager.AddSubordinate(designer1)
	designManager.AddSubordinate(designer2)
	ceo.AddSubordinate(designManager)

	fmt.Println("\nAfter adding Design Manager and Designers:")
	ceo.Print("")
}