
interface FitnessDataObserver {
  update(data: FitnessData): void;
}

interface FitnessDataSubject {
  registerObserver(observer: FitnessDataObserver): void;
  removeObserver(observer: FitnessDataObserver): void;
  notifyObservers(): void;
}

class FitnessData implements FitnessDataSubject {
  private steps: number = 0;
  private activeMinutes: number = 0;
  private calories: number = 0;

  private readonly observers: FitnessDataObserver[] = [];

  registerObserver(observer: FitnessDataObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: FitnessDataObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  private notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  newFitnessDataPushed(steps: number, activeMinutes: number, calories: number): void {
    this.steps = steps;
    this.activeMinutes = activeMinutes;
    this.calories = calories;

    console.log("\nFitnessData: New data received – Steps: " + steps +
      ", Active Minutes: " + activeMinutes + ", Calories: " + calories);

    this.notifyObservers();
  }

  dailyReset(): void {
    this.steps = 0;
    this.activeMinutes = 0;
    this.calories = 0;

    console.log("\nFitnessData: Daily reset performed.");
    this.notifyObservers();
  }

  // Getters
  getSteps(): number { return this.steps; }
  getActiveMinutes(): number { return this.activeMinutes; }
  getCalories(): number { return this.calories; }
}

class LiveActivityDisplay implements FitnessDataObserver {
  update(data: FitnessData): void {
    console.log("Live Display → Steps: " + data.getSteps() +
      " | Active Minutes: " + data.getActiveMinutes() +
      " | Calories: " + data.getCalories());
  }
}

class ProgressLogger implements FitnessDataObserver {
  update(data: FitnessData): void {
    console.log("Logger → Saving to DB: Steps=" + data.getSteps() +
      ", ActiveMinutes=" + data.getActiveMinutes() +
      ", Calories=" + data.getCalories());
    // Simulated DB/file write...
  }
}

class GoalNotifier implements FitnessDataObserver {
  private readonly stepGoal: number = 10000;
  private goalReached: boolean = false;

  update(data: FitnessData): void {
    if (data.getSteps() >= this.stepGoal && !this.goalReached) {
      console.log("Notifier → 🎉 Goal Reached! You've hit " + this.stepGoal + " steps!");
      this.goalReached = true;
    }
  }

  reset(): void {
    this.goalReached = false;
  }
}


const fitnessData = new FitnessData();

const display = new LiveActivityDisplay();
const logger = new ProgressLogger();
const notifier = new GoalNotifier();

// Register observers
fitnessData.registerObserver(display);
fitnessData.registerObserver(logger);
fitnessData.registerObserver(notifier);

// Simulate updates
fitnessData.newFitnessDataPushed(500, 5, 20);
fitnessData.newFitnessDataPushed(9800, 85, 350);
fitnessData.newFitnessDataPushed(10100, 90, 380);

// Remove logger and reset notifier
fitnessData.removeObserver(logger);
notifier.reset();
fitnessData.dailyReset();


class WeeklySummaryGenerator implements FitnessDataObserver {
  private totalSteps: number = 0;
  private totalActiveMinutes: number = 0;
  private totalCalories: number = 0;
  private updateCount: number = 0;

  update(data: FitnessData): void {
    this.totalSteps += data.getSteps();
    this.totalActiveMinutes += data.getActiveMinutes();
    this.totalCalories += data.getCalories();
    this.updateCount++;

    console.log("Weekly Summary -> Accumulated " + this.updateCount +
      " updates. Total Steps: " + this.totalSteps);
  }

  generateReport(): void {
    console.log("\n=== Weekly Summary Report ===");
    console.log("Total Steps: " + this.totalSteps);
    console.log("Total Active Minutes: " + this.totalActiveMinutes);
    console.log("Total Calories: " + this.totalCalories);
    console.log("Data Points Collected: " + this.updateCount);
    const avg = this.updateCount > 0 ? Math.floor(this.totalSteps / this.updateCount) : 0;
    console.log("Avg Steps/Update: " + avg);
  }

  reset(): void {
    this.totalSteps = 0;
    this.totalActiveMinutes = 0;
    this.totalCalories = 0;
    this.updateCount = 0;
  }
};


const summary = new WeeklySummaryGenerator();
fitnessData.registerObserver(summary);

// ... after a week of updates ...
summary.generateReport();
summary.reset();
