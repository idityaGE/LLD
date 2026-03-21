// Factory Method Pattern Example: Notification System

// #======= Product Interface =======#
interface Notification {
  send(message: string): void;
}

// #======= Concrete Products =======#
class EmailNotification implements Notification {
  send(message: string): void {
    console.log(`Sending email notification: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(message: string): void {
    console.log(`Sending SMS notification: ${message}`);
  }
}

class PushNotification implements Notification {
  send(message: string): void {
    console.log(`Sending push notification: ${message}`);
  }
}

class SlackNotification implements Notification {
  send(message: string): void {
    console.log(`Sending Slack notification: ${message}`);
  }
}

// #======= Factory =======#
abstract class NotificationFactory {
  abstract createNotification(): Notification;

  send(msg: string): void {
    const notification = this.createNotification();
    notification.send(msg);
  }
}

// #======= Concrete Factories =======#
class EmailNotificationFactory extends NotificationFactory {
  createNotification(): Notification {
    return new EmailNotification();
  }
}

class SMSNotificationFactory extends NotificationFactory {
  createNotification(): Notification {
    return new SMSNotification();
  }
}

class PushNotificationFactory extends NotificationFactory {
  createNotification(): Notification {
    return new PushNotification();
  }
}

class SlackNotificationFactory extends NotificationFactory {
  createNotification(): Notification {
    return new SlackNotification();
  }
}

// #======= Client Code =======#
const emailFactory = new EmailNotificationFactory();
emailFactory.send("Hello via Email!");

const smsFactory = new SMSNotificationFactory();  
smsFactory.send("Hello via SMS!");

const pushFactory = new PushNotificationFactory();
pushFactory.send("Hello via Push!");

const slackFactory = new SlackNotificationFactory();
slackFactory.send("Hello via Slack!");


// #======= Adding a New Notification Type =======#
class WhatsAppNotification implements Notification {
  send(message: string): void {
    console.log(`Sending WhatsApp notification: ${message}`);
  }
}

class WhatsAppNotificationFactory extends NotificationFactory {
  createNotification(): Notification {
    return new WhatsAppNotification();
  }
}

// Client code to use the new notification type
const whatsappFactory = new WhatsAppNotificationFactory();
whatsappFactory.send("Hello via WhatsApp!");