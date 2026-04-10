


class Light {
  private isOn: boolean;

  constructor() {
    this.isOn = false
  }

  on() {
    this.isOn = true
  }

  off() {
    this.isOn = false
  }

  toggle() {
    this.isOn = !this.isOn
  }

  getState() {
    return this.isOn
  }
}

class Thermostat {
  private temp: number;

  constructor() {
    this.temp = 24
  }

  setTemperature(value: number) {
    this.temp = value;
  }

  getTemp() {
    return this.temp
  }
}

interface Command {
  execute(): void
  undo(): void
}

class LightOnCommand implements Command {
  private lightClass: Light = new Light();

  execute(): void {
    this.lightClass.on()
  }

  undo(): void {
    this.lightClass.off()
  }
}

class ThermostatCommand implements Command {
  private thermostat: Thermostat = new Thermostat();
  private lastValue: number;
  private newValue: number;

  constructor(value: number) {
    this.newValue = value
    this.lastValue = this.thermostat.getTemp()
  }

  execute(): void {
    this.thermostat.setTemperature(this.newValue)
  }

  undo(): void {
    this.thermostat.setTemperature(this.lastValue)
  }

}


class Invoker {
  private history: Array<Command> = [];

  constructor() { }

  setCommand(cmd: Command) {
    this.history.push(cmd)
  }

  executeCmd() {
    this.history[this.history.length - 1].execute()
  }

  undoCommand() {
    const cmd = this.history.pop()
    cmd?.undo()
  }
}











