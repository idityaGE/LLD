package prototype

type EnemyPrototype interface {
	Clone() EnemyPrototype
}