package singleton

import (
	"fmt"
	"sync"
)

type DBConnection struct {
	ID int
}

type DBConnectionPool struct {
	pool chan *DBConnection
}

var (
	dbPoolInstance *DBConnectionPool
	dbPoolOnce     sync.Once
)

func GetDBConnectionPool(size int) *DBConnectionPool {
	dbPoolOnce.Do(func() {
		if size <= 0 {
			size = 2
		}

		ch := make(chan *DBConnection, size)
		for i := 1; i <= size; i++ {
			ch <- &DBConnection{ID: i}
		}

		dbPoolInstance = &DBConnectionPool{pool: ch}
	})

	return dbPoolInstance
}

func (p *DBConnectionPool) Acquire() *DBConnection {
	return <-p.pool
}

func (p *DBConnectionPool) Release(conn *DBConnection) {
	if conn == nil {
		return
	}
	p.pool <- conn
}

func RunDBPoolExerciseDemo() {
	poolA := GetDBConnectionPool(2)
	poolB := GetDBConnectionPool(5) // ignored after first initialization

	fmt.Printf("DB pool singleton shared instance: %v\n", poolA == poolB)

	conn1 := poolA.Acquire()
	conn2 := poolB.Acquire()

	fmt.Printf("Acquired connections: %d, %d\n", conn1.ID, conn2.ID)

	poolA.Release(conn1)
	poolB.Release(conn2)

	fmt.Println("Connections released back to pool")
}
