package singleton

import (
	"errors"
	"sync"
	"time"
)

var (
	ErrExpired  = errors.New("expired")
	ErrNotFound = errors.New("not found")
)

type CacheEntry struct {
	value     string
	validTill time.Time
	hasTTL    bool
}

type CacheManager struct {
	memory map[string]CacheEntry
	mut    sync.Mutex
}

var (
	instance *CacheManager
	once     sync.Once
)

func NewCacheManager() *CacheManager {
	once.Do(func() {
		instance = &CacheManager{
			memory: make(map[string]CacheEntry),
		}
	})
	return instance
}

func (s *CacheManager) set(key, val string, ttl time.Duration) {
	entry := CacheEntry{
		value:  val,
		hasTTL: ttl > 0,
	}
	if ttl > 0 {
		entry.validTill = time.Now().Add(ttl)
	}

	s.mut.Lock()
	defer s.mut.Unlock()
	s.memory[key] = entry
}

func (s *CacheManager) get(key string) (CacheEntry, error) {
	s.mut.Lock()
	defer s.mut.Unlock()

	entry, exists := s.memory[key]
	if !exists {
		return CacheEntry{}, ErrNotFound
	}
	if entry.hasTTL && time.Now().After(entry.validTill) {
		delete(s.memory, key)
		return CacheEntry{}, ErrExpired
	}
	return entry, nil
}

func (s *CacheManager) remove(key string) error {
	s.mut.Lock()
	defer s.mut.Unlock()

	if _, exists := s.memory[key]; !exists {
		return ErrNotFound
	}
	delete(s.memory, key)
	return nil
}

func (s *CacheManager) size() int {
	s.mut.Lock()
	defer s.mut.Unlock()

	now := time.Now()
	for key, val := range s.memory {
		if val.hasTTL && now.After(val.validTill) {
			delete(s.memory, key)
		}
	}
	return len(s.memory)
}
func main() {
	RunLoggerExerciseDemo()
	RunDBPoolExerciseDemo()
}
