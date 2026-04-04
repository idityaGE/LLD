
type Order = {
  getTotalWeight(): number;
  getDestinationZone(): string;
  getOrderValue(): number;
};


interface ShippingStrategy {
  calculateCost(order: Order): number;
}

class FlatRateShipping implements ShippingStrategy {
  private rate: number;

  constructor(rate: number) {
    this.rate = rate;
  }

  calculateCost(order: Order): number {
    console.log("Calculating with Flat Rate strategy ($" + this.rate + ")");
    return this.rate;
  }
}

class WeightBasedShipping implements ShippingStrategy {
  private readonly ratePerKg: number;

  constructor(ratePerKg: number) {
    this.ratePerKg = ratePerKg;
  }

  calculateCost(order: Order): number {
    console.log("Calculating with Weight-Based strategy ($" + this.ratePerKg + "/kg)");
    return order.getTotalWeight() * this.ratePerKg;
  }
}

class DistanceBasedShipping implements ShippingStrategy {
  private ratePerKm: number;

  constructor(ratePerKm: number) {
    this.ratePerKm = ratePerKm;
  }

  calculateCost(order: Order): number {
    console.log("Calculating with Distance-Based strategy for zone: " + order.getDestinationZone());
    switch (order.getDestinationZone()) {
      case "ZoneA":
        return this.ratePerKm * 5.0;
      case "ZoneB":
        return this.ratePerKm * 7.0;
      default:
        return this.ratePerKm * 10.0;
    }
  }
}

class ThirdPartyApiShipping implements ShippingStrategy {
  private readonly baseFee: number;
  private readonly percentageFee: number;

  constructor(baseFee: number, percentageFee: number) {
    this.baseFee = baseFee;
    this.percentageFee = percentageFee;
  }

  calculateCost(order: Order): number {
    console.log("Calculating with Third-Party API strategy.");
    // Simulate API call
    return this.baseFee + (order.getOrderValue() * this.percentageFee);
  }
}

class ShippingCostService {
  private strategy: ShippingStrategy;

  // Constructor to set initial strategy
  constructor(strategy: ShippingStrategy) {
    this.strategy = strategy;
  }

  // Method to change strategy at runtime
  setStrategy(strategy: ShippingStrategy): void {
    console.log("ShippingCostService: Strategy changed to " + strategy.constructor.name);
    this.strategy = strategy;
  }

  calculateShippingCost(order: Order): number {
    if (!this.strategy) {
      throw new Error("Shipping strategy not set.");
    }
    const cost = this.strategy.calculateCost(order);
    console.log("ShippingCostService: Final Calculated Shipping Cost: $" + cost +
      " (using " + this.strategy.constructor.name + ")");
    return cost;
  }
}

class ECommerceAppV2 {
  static main(): void {
    const order1 = new Order();

    // Create different strategy instances
    const flatRate: ShippingStrategy = new FlatRateShipping(10.0);
    const weightBased: ShippingStrategy = new WeightBasedShipping(2.5);
    const distanceBased: ShippingStrategy = new DistanceBasedShipping(5.0);
    const thirdParty: ShippingStrategy = new ThirdPartyApiShipping(7.5, 0.02);

    // Create context with an initial strategy
    const shippingService = new ShippingCostService(flatRate);

    console.log("--- Order 1: Using Flat Rate (initial) ---");
    shippingService.calculateShippingCost(order1);

    console.log("\n--- Order 1: Changing to Weight-Based ---");
    shippingService.setStrategy(weightBased);
    shippingService.calculateShippingCost(order1);

    console.log("\n--- Order 1: Changing to Distance-Based ---");
    shippingService.setStrategy(distanceBased);
    shippingService.calculateShippingCost(order1);

    console.log("\n--- Order 1: Changing to Third-Party API ---");
    shippingService.setStrategy(thirdParty);
    shippingService.calculateShippingCost(order1);

    // Adding a NEW strategy is easy:
    // 1. Create a new class implementing ShippingStrategy (e.g., FreeShippingStrategy)
    // 2. Client can then instantiate and use it:
    //    const freeShipping: ShippingStrategy = new FreeShippingStrategy();
    //    shippingService.setStrategy(freeShipping);
    //    shippingService.calculateShippingCost(primeMemberOrder);
    // No modification to ShippingCostService is needed!
  }
}