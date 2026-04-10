package main

import "fmt"

type TextEditor struct {
	content string
}

func (t *TextEditor) append(str string) {
	t.content += str
}

func (t *TextEditor) delete() string {
	last := ""
	if len(t.content) > 0 {
		last = t.content[:len(t.content)-1]
		t.content = t.content[:len(t.content)-1]
	}
	return last
}

func (t *TextEditor) getContent() string {
	return t.content
}

type Command interface {
	execute()
	undo()
}

type TypeCommand struct {
	editor *TextEditor
	text   string
}

func NewTypeCommand(str string, editor *TextEditor) *TypeCommand {
	return &TypeCommand{
		editor: editor,
		text:   str,
	}
}

func (t *TypeCommand) execute() {
	t.editor.append(t.text)
}

func (t *TypeCommand) undo() {
	for i := 0; i < len(t.text); i++ {
		t.editor.delete()
	}
}

type DeleteCommand struct {
	editor      *TextEditor
	lastDeleted string
}

func NewDeleteCommand(editor *TextEditor) *DeleteCommand {
	return &DeleteCommand{
		editor:      editor,
		lastDeleted: "",
	}
}

func (d *DeleteCommand) execute() {
	d.lastDeleted = d.editor.delete()
}

func (d *DeleteCommand) undo() {
	d.editor.append(d.lastDeleted)
}

type Invoker struct {
	undoStack []Command
	redoStack []Command
}

func (i *Invoker) execute(cmd Command) {
	i.undoStack = append(i.undoStack, cmd)
	cmd.execute()
}

func (i *Invoker) undo() {
	if len(i.undoStack) > 0 {
		cmd := i.undoStack[len(i.undoStack)-1]
		i.undoStack = i.undoStack[:len(i.undoStack)-1]
		cmd.undo()
		i.redoStack = append(i.redoStack, cmd)
	}
}

func (i *Invoker) redo() {
	if len(i.redoStack) > 0 {
		cmd := i.redoStack[len(i.redoStack)-1]
		i.redoStack = i.redoStack[:len(i.redoStack)-1]
		cmd.execute()
		i.undoStack = append(i.undoStack, cmd)
	}
}

func main() {
	invoker := Invoker{
		redoStack: make([]Command, 0),
		undoStack: make([]Command, 0),
	}

	editor := &TextEditor{}

	// Type "Hello, "
	typeCommand1 := NewTypeCommand("Hello, ", editor)
	invoker.execute(typeCommand1)
	fmt.Println(editor.getContent())

	// Type "World!"
	typeCommand2 := NewTypeCommand("World!", editor)
	invoker.execute(typeCommand2)
	fmt.Println(editor.getContent())

	// Undo the last type
	invoker.undo()
	fmt.Println(editor.getContent())

	// Redo the last undone command
	invoker.redo()
	fmt.Println(editor.getContent())

	// Delete the last character
	deleteCommand := NewDeleteCommand(editor)
	invoker.execute(deleteCommand)
	fmt.Println(editor.getContent())

	// Undo the deletion
	invoker.undo()
	fmt.Println(editor.getContent())
}
