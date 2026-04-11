class VendingMachine {
  private currentState: MachineState;
  private selectedItem: string;
  private insertedAmount: number;

  constructor() {
    this.currentState = new IdleState();
  }

  setState(newState: MachineState): void {
    this.currentState = newState;
  }

  setSelectedItem(itemCode: string): void {
    this.selectedItem = itemCode;
  }

  setInsertedAmount(amount: number): void {
    this.insertedAmount = amount;
  }

  getSelectedItem(): string {
    return this.selectedItem;
  }

  selectItem(itemCode: string): void {
    this.currentState.selectItem(this, itemCode);
  }

  insertCoin(amount: number): void {
    this.currentState.insertCoin(this, amount);
  }

  dispenseItem(): void {
    this.currentState.dispenseItem(this);
  }

  reset(): void {
    this.selectedItem = "";
    this.insertedAmount = 0.0;
    this.currentState = new IdleState();
  }
}

interface MachineState {
  selectItem(context: VendingMachine, itemCode: string): void;
  insertCoin(context: VendingMachine, amount: number): void;
  dispenseItem(context: VendingMachine): void;
}

class IdleState implements MachineState {
  selectItem(context: VendingMachine, itemCode: string): void {
    console.log("Item selected: " + itemCode);
    context.setSelectedItem(itemCode);
    context.setState(new ItemSelectedState());
  }

  insertCoin(context: VendingMachine, amount: number): void {
    console.log("Please select an item before inserting coins.");
  }

  dispenseItem(context: VendingMachine): void {
    console.log("No item selected. Nothing to dispense.");
  }
}

class ItemSelectedState implements MachineState {
  selectItem(context: VendingMachine, itemCode: string): void {
    console.log("Item already selected: " + context.getSelectedItem());
  }

  insertCoin(context: VendingMachine, amount: number): void {
    console.log("Inserted $" + amount + " for item: " + context.getSelectedItem());
    context.setInsertedAmount(amount);
    context.setState(new HasMoneyState());
  }

  dispenseItem(context: VendingMachine): void {
    console.log("Insert coin before dispensing.");
  }
}

class HasMoneyState implements MachineState {
  selectItem(context: VendingMachine, itemCode: string): void {
    console.log("Cannot change item after inserting money.");
  }

  insertCoin(context: VendingMachine, amount: number): void {
    console.log("Money already inserted.");
  }

  dispenseItem(context: VendingMachine): void {
    console.log("Dispensing item: " + context.getSelectedItem());
    context.setState(new DispensingState());
    console.log("Item dispensed successfully.");
    context.reset();
  }
}

class DispensingState implements MachineState {
  selectItem(context: VendingMachine, itemCode: string): void {
    console.log("Please wait, dispensing in progress.");
  }

  insertCoin(context: VendingMachine, amount: number): void {
    console.log("Please wait, dispensing in progress.");
  }

  dispenseItem(context: VendingMachine): void {
    console.log("Already dispensing. Please wait.");
  }
}

const vm = new VendingMachine();

vm.insertCoin(1.0);   // Rejected: no item selected
vm.selectItem("A1");  // Transitions to ItemSelectedState
vm.insertCoin(1.5);   // Transitions to HasMoneyState
vm.dispenseItem();    // Dispenses, resets to IdleState

console.log("\n--- Second Transaction ---");
vm.selectItem("B2");
vm.insertCoin(2.0);
vm.dispenseItem();