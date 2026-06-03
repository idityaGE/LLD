// ─── Custom Request class (avoids collision with built-in Request) ──────────
class AppRequest {
  constructor(
    public user: string | null,
    public userRole: string,
    public requestCount: number,
    public payload: string | null
  ) { }
}

// ─── Interface ─────────────────────────────────────────────────────────────
interface RequestHandler {
  setNext(next: RequestHandler): RequestHandler;
  handle(req: AppRequest): void;
}

// ─── Abstract Base ─────────────────────────────────────────────────────────
abstract class BaseHandler implements RequestHandler {
  protected next: RequestHandler | null = null;

  setNext(next: RequestHandler): RequestHandler {
    this.next = next;
    return next;
  }

  protected forward(request: AppRequest) {
    if (this.next) {
      this.next.handle(request);
    }
  }

  abstract handle(req: AppRequest): void;
}

// ─── Concrete Handlers ─────────────────────────────────────────────────────

class AuthHandler extends BaseHandler {
  handle(request: AppRequest): void {
    if (request.user === null) {
      console.log("AuthHandler: User not authenticated.");
      return;
    }
    console.log("AuthHandler: Authenticated.");
    this.forward(request);
  }
}

class AuthorizationHandler extends BaseHandler {
  handle(request: AppRequest): void {
    if (request.userRole !== "ADMIN") {
      console.log("AuthorizationHandler: Access denied.");
      return;
    }
    console.log("AuthorizationHandler: Authorized.");
    this.forward(request);
  }
}

class RateLimitHandler extends BaseHandler {
  handle(request: AppRequest): void {
    if (request.requestCount >= 100) {
      console.log("RateLimitHandler: Rate limit exceeded.");
      return;
    }
    console.log("RateLimitHandler: Within rate limit.");
    this.forward(request);
  }
}

class ValidationHandler extends BaseHandler {
  handle(request: AppRequest): void {
    if (request.payload === null || request.payload.trim() === "") {
      console.log("ValidationHandler: Invalid payload.");
      return;
    }
    console.log("ValidationHandler: Payload valid.");
    this.forward(request);
  }
}

class BusinessLogicHandler extends BaseHandler {
  handle(request: AppRequest): void {
    console.log(
      `BusinessLogicHandler: Processing request for ${request.user}...`
    );
  }
}

// ─── App ───────────────────────────────────────────────────────────────────

class RequestHandlerApp {
  static main(): void {
    const auth = new AuthHandler();
    const authorization = new AuthorizationHandler();
    const rateLimit = new RateLimitHandler();
    const validation = new ValidationHandler();
    const businessLogic = new BusinessLogicHandler();

    auth
      .setNext(authorization)
      .setNext(rateLimit)
      .setNext(validation)
      .setNext(businessLogic);

    console.log("--- Valid request ---");
    const request = new AppRequest("john", "ADMIN", 10, '{ "data": "valid" }');
    auth.handle(request);

    console.log("\n--- Unauthenticated request ---");
    const badRequest = new AppRequest(null, "USER", 150, "");
    auth.handle(badRequest);
  }
}

RequestHandlerApp.main();
