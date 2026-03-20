use std::sync::{Arc, Condvar, Mutex, OnceLock};

#[derive(Debug, Clone)]
struct DbConnection {
    id: usize,
}

#[derive(Debug)]
struct PoolState {
    available: Vec<DbConnection>,
}

struct DbConnectionPool {
    // Mutex protects the shared pool state from data races.
    state: Mutex<PoolState>,
    // Condvar lets threads wait until a connection becomes available.
    condvar: Condvar,
}

impl DbConnectionPool {
    fn new(size: usize) -> Self {
        let mut available = Vec::with_capacity(size);
        for i in 1..=size {
            available.push(DbConnection { id: i });
        }

        Self {
            state: Mutex::new(PoolState { available }),
            condvar: Condvar::new(),
        }
    }

    fn acquire(&self) -> DbConnection {
        let mut guard = self.state.lock().expect("pool lock poisoned");
        loop {
            if let Some(conn) = guard.available.pop() {
                return conn;
            }
            // No connection is available, so this thread sleeps and waits.
            // wait() atomically unlocks the mutex while waiting and locks it
            // again before returning.
            guard = self
                .condvar
                .wait(guard)
                .expect("pool lock poisoned while waiting");
        }
    }

    fn release(&self, conn: DbConnection) {
        let mut guard = self.state.lock().expect("pool lock poisoned");
        guard.available.push(conn);
        // Wake one waiting thread now that a connection is back in the pool.
        self.condvar.notify_one();
    }

    fn available_count(&self) -> usize {
        let guard = self.state.lock().expect("pool lock poisoned");
        guard.available.len()
    }
}

// OnceLock initializes the singleton exactly once in a thread-safe way.
// Arc enables shared ownership of the same pool across callers.
static DB_POOL: OnceLock<Arc<DbConnectionPool>> = OnceLock::new();

fn get_db_pool(size: usize) -> Arc<DbConnectionPool> {
    DB_POOL
        // Only the first call uses `size`; later calls reuse the same instance.
        .get_or_init(|| Arc::new(DbConnectionPool::new(size.max(1))))
        .clone()
}

fn main() {
    let pool_a = get_db_pool(2);
    let pool_b = get_db_pool(10); // ignored after first initialization

    println!(
        "DB pool singleton shared instance: {}",
        Arc::ptr_eq(&pool_a, &pool_b)
    );

    let conn1 = pool_a.acquire();
    let conn2 = pool_b.acquire();

    println!("Acquired connections: {}, {}", conn1.id, conn2.id);
    println!("Available after acquire: {}", pool_a.available_count());

    pool_a.release(conn1);
    pool_b.release(conn2);

    println!("Available after release: {}", pool_a.available_count());
}
