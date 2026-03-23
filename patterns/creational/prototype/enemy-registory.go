package prototype

type EnemyRegistry struct {
	registry map[string]EnemyPrototype
}

func NewEnemyRegistry() *EnemyRegistry {
	return &EnemyRegistry{
		registry: make(map[string]EnemyPrototype),
	}
}

func (er *EnemyRegistry) RegisterEnemy(name string, prototype EnemyPrototype) {
	er.registry[name] = prototype
}

func (er *EnemyRegistry) GetEnemy(name string) EnemyPrototype {
	if prototype, exists := er.registry[name]; exists {
		return prototype.Clone()
	}
	return nil
}
