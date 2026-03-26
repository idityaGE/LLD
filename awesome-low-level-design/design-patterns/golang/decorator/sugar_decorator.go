package decorator

type SugarDecorator struct {
	*BeveragDecorator
}

func NewSugarDecorator(beverage Beverage) *SugarDecorator {
	return &SugarDecorator{
		BeveragDecorator: NewBeverageDecorator(beverage),
	}
}

func (d *SugarDecorator) GetDescription() string {
	return d.BeveragDecorator.GetDescription() + ", Sugar"
}

func (d *SugarDecorator) Cost() float64 {
	return d.BeveragDecorator.Cost() + 0.2
}
