package flyweight

import "fmt"

type TreeType interface {
	Draw(x, y int)
}

type TreeTypeImpl struct {
	name    string
	color   string
	height  int
	texture string
}

func NewTreeType(name, color string, height int, texture string) *TreeTypeImpl {
	return &TreeTypeImpl{name: name, color: color, height: height, texture: texture}
}

func (t *TreeTypeImpl) Draw(x, y int) {
	// Draw the tree at the specified coordinates.
	fmt.Printf("Drawing tree: %s at (%d, %d)\n", t.name, x, y)
}

type treeTypeKey struct {
	name    string
	color   string
	height  int
	texture string
}

type TreeFactory struct {
	treeTypes map[treeTypeKey]TreeType
}

func NewTreeFactory() *TreeFactory {
	return &TreeFactory{treeTypes: make(map[treeTypeKey]TreeType)}
}

func (f *TreeFactory) GetTreeType(name, color string, height int, texture string) TreeType {
	key := treeTypeKey{name: name, color: color, height: height, texture: texture}
	if treeType, exists := f.treeTypes[key]; exists {
		return treeType
	}

	treeType := NewTreeType(name, color, height, texture)
	f.treeTypes[key] = treeType
	return treeType
}

type Tree struct {
	x, y     int
	treeType TreeType
}

func NewTree(x, y int, treeType TreeType) *Tree {
	return &Tree{x: x, y: y, treeType: treeType}
}

func (t *Tree) Draw() {
	t.treeType.Draw(t.x, t.y)
}

// Example usage
type Forest struct {
	factory *TreeFactory
	trees   []*Tree
}

func NewForest() *Forest {
	return &Forest{factory: NewTreeFactory(), trees: []*Tree{}}
}

func (f *Forest) PlantTree(x, y int, name, color string, height int, texture string) {
	treeType := f.factory.GetTreeType(name, color, height, texture)
	tree := NewTree(x, y, treeType)
	f.trees = append(f.trees, tree)
}

func (f *Forest) Draw() {
	for _, tree := range f.trees {
		tree.Draw()
	}
}
