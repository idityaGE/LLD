package singleton

import (
	"fmt"
	"sync"
)

type LogLevel int

const (
	DEBUG LogLevel = iota
	INFO
	WARN
	ERROR
)

func (l LogLevel) String() string {
	switch l {
	case DEBUG:
		return "DEBUG"
	case INFO:
		return "INFO"
	case WARN:
		return "WARN"
	case ERROR:
		return "ERROR"
	default:
		return "UNKNOWN"
	}
}

type Logger struct {
	level LogLevel
	mut   sync.Mutex
}

var (
	loggerInstance *Logger
	loggerOnce     sync.Once
)

func GetLogger() *Logger {
	loggerOnce.Do(func() {
		loggerInstance = &Logger{level: INFO}
	})
	return loggerInstance
}

func (l *Logger) SetLevel(level LogLevel) {
	l.mut.Lock()
	defer l.mut.Unlock()
	l.level = level
}

func (l *Logger) Log(level LogLevel, message string) {
	l.mut.Lock()
	minLevel := l.level
	l.mut.Unlock()

	if level < minLevel {
		return
	}
	fmt.Printf("[%s] %s\n", level.String(), message)
}

func RunLoggerExerciseDemo() {
	loggerA := GetLogger()
	loggerB := GetLogger()

	fmt.Printf("Logger singleton shared instance: %v\n", loggerA == loggerB)

	loggerA.SetLevel(INFO)
	loggerA.Log(DEBUG, "this debug log is filtered")
	loggerA.Log(INFO, "application started")
	loggerB.Log(ERROR, "error while connecting to service")
}
