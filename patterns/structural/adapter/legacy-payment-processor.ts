
// Interface that the client code expects
interface PaymentProcessor {
  processPayment(amount: number, currency: string): void;
  isPaymentSuccessful(): boolean;
  getTransactionId(): string;
}

// #===== Modern Implementation =====#
class InHousePaymentProcessor implements PaymentProcessor {
  private transactionId: string = "";
  private paymentSuccess: boolean = false;

  processPayment(amount: number, currency: string): void {
    console.log(`InHouseProcessor: Processing ${amount} ${currency}`);
    this.transactionId = "TXN_" + Date.now();
    this.paymentSuccess = true;
    console.log(`InHouseProcessor: Success. Txn ID: ${this.transactionId}`);
  }

  isPaymentSuccessful(): boolean {
    return this.paymentSuccess;
  }

  getTransactionId(): string {
    return this.transactionId;
  }
}

// #===== Client Code =====#
class CheckoutService {
  private processor: PaymentProcessor;

  constructor(processor: PaymentProcessor) {
    this.processor = processor;
  }

  checkout(amount: number, currency: string): void {
    console.log(`Checkout: Processing order for $${amount} ${currency}`);
    this.processor.processPayment(amount, currency);
    if (this.processor.isPaymentSuccessful()) {
      console.log(`Checkout: Order successful! Txn: ${this.processor.getTransactionId()}`);
    } else {
      console.log("Checkout: Order failed.");
    }
  }
}

// #===== Client Usage =====#
const processor: PaymentProcessor = new InHousePaymentProcessor();
const checkout = new CheckoutService(processor);
checkout.checkout(199.99, "USD");


// #==== Incompatible Legacy Implementation (Adaptee) ====#
class LegacyGateway {
  private transactionReference: number = 0;
  private paymentSuccessful: boolean = false;

  executeTransaction(totalAmount: number, currency: string): void {
    console.log(`LegacyGateway: Executing ${currency} ${totalAmount}`);
    this.transactionReference = Date.now() * 1000000 + Math.floor(Math.random() * 1000000);
    this.paymentSuccessful = true;
    console.log(`LegacyGateway: Done. Ref: ${this.transactionReference}`);
  }

  checkStatus(ref: number): boolean {
    console.log(`LegacyGateway: Checking status for ref: ${ref}`);
    return this.paymentSuccessful;
  }

  getReferenceNumber(): number {
    return this.transactionReference;
  }
}

class LegacyGatewayAdapter implements PaymentProcessor {
  private readonly legacyGateway: LegacyGateway;
  private currentRef: number = 0;

  constructor(legacyGateway: LegacyGateway) {
    this.legacyGateway = legacyGateway;
  }

  processPayment(amount: number, currency: string): void {
    console.log("Adapter: Translating processPayment() for " + amount + " " + currency);
    this.legacyGateway.executeTransaction(amount, currency);
    this.currentRef = this.legacyGateway.getReferenceNumber(); // Store for later use
  }

  isPaymentSuccessful(): boolean {
    return this.legacyGateway.checkStatus(this.currentRef);
  }

  getTransactionId(): string {
    return "LEGACY_TXN_" + this.currentRef;
  }
}


class ECommerceAppV2 {
  static main(): void {
    // Modern processor
    let processor: PaymentProcessor = new InHousePaymentProcessor();
    const modernCheckout = new CheckoutService(processor);
    console.log("--- Using Modern Processor ---");
    modernCheckout.checkout(199.99, "USD");

    // Legacy gateway through adapter
    console.log("\n--- Using Legacy Gateway via Adapter ---");
    const legacy = new LegacyGateway();
    processor = new LegacyGatewayAdapter(legacy);
    const legacyCheckout = new CheckoutService(processor);
    legacyCheckout.checkout(75.50, "USD");
  }
}

