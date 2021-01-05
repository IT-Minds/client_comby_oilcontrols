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

  transformOptions(options: RequestInit): Promise<RequestInit> {
    return this.authClient
      ? this.authClient.transformHttpRequestOptions(options)
      : Promise.resolve(options);
  }
}
