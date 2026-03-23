interface Notification {
    send(message: string): void;
}

class EmailNotification implements Notification {
    send(message: string): void {
        console.log(`Sending email: ${message}`);
    }
}

class SMSNotification implements Notification {
    send(message: string): void {
        console.log(`Sending SMS: ${message}`);
    }
}

class PushNotification implements Notification {
    send(message: string): void {
        console.log(`Sending push notification: ${message}`);
    }
}

class SlackNotification implements Notification {
    send(message: string): void {
        console.log(`Sending Slack message: ${message}`);
    }
}


class AlertService {
    constructor(private notification: Notification) { }
    alert(msg: string) {
        this.notification.send(msg); // same object every time
    }
}

abstract class NotificationCreator {
    // Factory Method - subclasses decide what to create
    abstract createNotification(): Notification;

    // Shared logic that uses the factory method
    send(message: string): void {
        const notification = this.createNotification();
        notification.send(message);
    }
}

class EmailNotificationCreator extends NotificationCreator {
    createNotification(): Notification {
        return new EmailNotification();
    }
}

class SMSNotificationCreator extends NotificationCreator {
    createNotification(): Notification {
        return new SMSNotification();
    }
}

class PushNotificationCreator extends NotificationCreator {
    createNotification(): Notification {
        return new PushNotification();
    }
}

class SlackNotificationCreator extends NotificationCreator {
    createNotification(): Notification {
        return new SlackNotification();
    }
}


class AlertService {
    constructor(private factory: NotificationFactory) { }
    alert(msg: string) {
        this.factory.send(msg);
    }
}
