package prototype

import "fmt"

type Enemy struct {
	Type    string
	Health  int
	Speed   float64
	Armored bool
	Weapon  string
}

func NewEnemy(type_ string, health int, speed float64, armored bool, weapon string) *Enemy {
	return &Enemy{
		Type:    type_,
		Health:  health,
		Speed:   speed,
		Armored: armored,
		Weapon:  weapon,
	}
}

func (e *Enemy) Clone() EnemyPrototype {
	return NewEnemy(e.Type, e.Health, e.Speed, e.Armored, e.Weapon)
}

func (e *Enemy) SetHealth(health int) {
	e.Health = health
}

func (e *Enemy) PrintStats() {
	fmt.Printf("%s [Health: %d, Speed: %.1f, Armored: %v, Weapon: %s]\n",
		e.Type, e.Health, e.Speed, e.Armored, e.Weapon)
}
