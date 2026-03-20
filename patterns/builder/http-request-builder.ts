class HTTPRequest {
  private url: string
  private method: string;
  private headers: Record<string, string>
  private body: string
  private queryParams: Record<string, string>
  private timeout: number

  constructor(builder: HTTPRequestBuilder) {
    this.url = builder.url
    this.method = builder.method
    this.headers = builder.headers
    this.body = builder.body
    this.queryParams = builder.queryParams
    this.timeout = builder.timeout
  }

  send() {
    // Logic to send the HTTP request using the configured properties
    console.log(`Sending ${this.method} request to ${this.url} with headers ${JSON.stringify(this.headers)}, body ${this.body}, query params ${JSON.stringify(this.queryParams)}, and timeout ${this.timeout}ms`)
  }


  static Builder = class HTTPRequestBuilder {
    url: string
    method: string = 'GET'
    headers: Record<string, string> = {}
    body: string = ''
    queryParams: Record<string, string> = {}
    timeout: number = 5000

    constructor(url: string) {
      this.url = url
    }

    setMethod(method: string) {
      this.method = method
      return this
    }

    addHeaders(headers: Record<string, string>) {
      this.headers = { ...this.headers, ...headers }
      return this
    }

    setBody(body: string) {
      this.body = body
      return this
    }

    addQueryParams(queryParams: Record<string, string>) {
      this.queryParams = { ...this.queryParams, ...queryParams }
      return this
    }

    setTimeout(timeout: number) {
      this.timeout = timeout
      return this
    }

    build() {
      return new HTTPRequest(this)
    }

  }
}

// Example usage:
// Simple GET request
const get = new HTTPRequest.Builder("https://api.example.com/users")
  .build();

// POST with body and custom timeout
const post = new HTTPRequest.Builder("https://api.example.com/users")
  .setMethod("POST")
  .addHeaders({ "Content-Type": "application/json" })
  .setBody('{"name":"Alice","email":"alice@example.com"}')
  .setTimeout(5000)
  .build();

// Authenticated PUT with query parameters
const put = new HTTPRequest.Builder("https://api.example.com/config")
  .setMethod("PUT")
  .addHeaders({ "Authorization": "Bearer token123", "Content-Type": "application/json" })
  .addQueryParams({ "env": "production" })
  .addQueryParams({ "version": "2" })
  .setBody('{"feature_flag":true}')
  .setTimeout(10000)
  .build();

get.send()
post.send()
put.send()



class HTTPRequestDirector {
  static createGetRequest(url: string) {
    return new HTTPRequest.Builder(url).build()
  }

  static createPostRequest(url: string, body: string) {
    return new HTTPRequest.Builder(url)
      .setMethod("POST")
      .addHeaders({ "Content-Type": "application/json" })
      .setBody(body)
      .build()
  }

  static createAuthenticatedPutRequest(url: string, body: string, token: string) {
    return new HTTPRequest.Builder(url)
      .setMethod("PUT")
      .addHeaders({ "Authorization": `Bearer ${token}`, "Content-Type": "application/json" })
      .setBody(body)
      .build()
  }
}
