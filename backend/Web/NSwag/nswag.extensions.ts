/* istanbul ignore file */
export class AuthClient {
  private accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  transformHttpRequestOptions(options: RequestInit): Promise<RequestInit> {
    if (options.headers && this.accessToken) {
      (<Record<string, string>>options.headers).Authorization =
        "Bearer " + this.accessToken;
      return Promise.resolve(options);
    }
    return Promise.resolve(null);
  }
}

export class ClientBase {
  constructor(private authClient: AuthClient) {}

  private cacheableResponse = false;
  private cacheStrategy: "CacheFirst" | "NetworkFirst" = "NetworkFirst";
  private cacheAllowStatuses: number[] = [200];
  private cacheableOptions: RequestInit = null;

  setCacheableResponse(
    cacheStrategy: ClientBase["cacheStrategy"] = "NetworkFirst",
    cacheAllowStatuses: ClientBase["cacheAllowStatuses"] = [200]
  ) {
    this.cacheableResponse = true;
    this.cacheStrategy = cacheStrategy;
    this.cacheAllowStatuses = cacheAllowStatuses;
  }

  async transformOptions(options: RequestInit): Promise<RequestInit> {
    const result = await (this.authClient
      ? this.authClient.transformHttpRequestOptions(options)
      : Promise.resolve(options));

    if (this.cacheableResponse) {
      this.cacheableOptions = result;
    }

    return result;
  }

  private async cacheResponse(
    request: Request,
    response: Response
  ): Promise<Response> {
    const cache = await caches.open("nswagts.v1");
    const cloned = response.clone();
    await cache.put(request, response);

    return cloned;
  }

  async transformResult(
    url: string,
    networkResponse: Response,
    cb: (response: Response) => any
  ) {
    let response: Response = networkResponse;
    if (process.browser && this.cacheableResponse) {
      console.debug("NswagTs transformResult cacheableResponse executing...");
      const request = new Request(url, this.cacheableOptions);

      const cacheResponse = await caches.match(request);

      const networkOk = this.cacheAllowStatuses.includes(
        networkResponse?.status ?? 0
      );
      const cacheOk = this.cacheAllowStatuses.includes(
        cacheResponse?.status ?? 0
      );

      if (this.cacheStrategy === "CacheFirst") {
        if (cacheOk) {
          console.debug(
            "NswagTs transformResult cacheableResponse cache first using cache",
            cacheResponse
          );
          response = cacheResponse;
        } else {
          console.debug(
            "NswagTs transformResult cacheableResponse cache first using network",
            networkResponse
          );
          response = networkOk
            ? await this.cacheResponse(request, networkResponse)
            : networkResponse;
        }
      } else if (this.cacheStrategy === "NetworkFirst") {
        if (networkOk) {
          console.debug(
            "NswagTs transformResult cacheableResponse network first using network ok",
            networkResponse
          );
          response = await this.cacheResponse(request, networkResponse);
        } else if (cacheOk) {
          console.debug(
            "NswagTs transformResult cacheableResponse network first using cache",
            cacheResponse
          );
          response = cacheResponse;
        } else {
          console.debug(
            "NswagTs transformResult cacheableResponse network first using network failure",
            networkResponse
          );
          response = networkResponse;
        }
      }
    }
    this.cacheableResponse = false;
    return cb(response);
  }
}
