/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.9.4.0 (NJsonSchema v10.3.1.0 (Newtonsoft.Json v12.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

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

export interface IExampleEntityClient {
    create(command: CreateExampleEntityCommand): Promise<number>;
    get(needle?: string | null | undefined, size?: number | undefined, sortBy?: string | null | undefined, skip?: number | null | undefined): Promise<PageResultOfExampleEntityDto>;
    update(id: number, command: UpdateExampleEntityCommand): Promise<FileResponse>;
    delete(id: number): Promise<FileResponse>;
}

export class ExampleEntityClient extends ClientBase implements IExampleEntityClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: AuthClient, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    create(command: CreateExampleEntityCommand): Promise<number> {
        let url_ = this.baseUrl + "/api/ExampleEntity";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(command);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processCreate(_response);
        });
    }

    protected processCreate(response: Response): Promise<number> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 !== undefined ? resultData200 : <any>null;
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<number>(<any>null);
    }

    get(needle?: string | null | undefined, size?: number | undefined, sortBy?: string | null | undefined, skip?: number | null | undefined): Promise<PageResultOfExampleEntityDto> {
        let url_ = this.baseUrl + "/api/ExampleEntity?";
        if (needle !== undefined && needle !== null)
            url_ += "needle=" + encodeURIComponent("" + needle) + "&";
        if (size === null)
            throw new Error("The parameter 'size' cannot be null.");
        else if (size !== undefined)
            url_ += "size=" + encodeURIComponent("" + size) + "&";
        if (sortBy !== undefined && sortBy !== null)
            url_ += "sortBy=" + encodeURIComponent("" + sortBy) + "&";
        if (skip !== undefined && skip !== null)
            url_ += "skip=" + encodeURIComponent("" + skip) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processGet(_response);
        });
    }

    protected processGet(response: Response): Promise<PageResultOfExampleEntityDto> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PageResultOfExampleEntityDto.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PageResultOfExampleEntityDto>(<any>null);
    }

    update(id: number, command: UpdateExampleEntityCommand): Promise<FileResponse> {
        let url_ = this.baseUrl + "/api/ExampleEntity/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(command);

        let options_ = <RequestInit>{
            body: content_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/octet-stream"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processUpdate(_response);
        });
    }

    protected processUpdate(response: Response): Promise<FileResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers ? response.headers.get("content-disposition") : undefined;
            const fileNameMatch = contentDisposition ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition) : undefined;
            const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
            return response.blob().then(blob => { return { fileName: fileName, data: blob, status: status, headers: _headers }; });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<FileResponse>(<any>null);
    }

    delete(id: number): Promise<FileResponse> {
        let url_ = this.baseUrl + "/api/ExampleEntity/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
                "Accept": "application/octet-stream"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processDelete(_response);
        });
    }

    protected processDelete(response: Response): Promise<FileResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers ? response.headers.get("content-disposition") : undefined;
            const fileNameMatch = contentDisposition ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition) : undefined;
            const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
            return response.blob().then(blob => { return { fileName: fileName, data: blob, status: status, headers: _headers }; });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<FileResponse>(<any>null);
    }
}

export interface IExampleEntityListClient {
    create(command: CreateExampleEntityListCommand): Promise<number>;
}

export class ExampleEntityListClient extends ClientBase implements IExampleEntityListClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: AuthClient, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    create(command: CreateExampleEntityListCommand): Promise<number> {
        let url_ = this.baseUrl + "/api/ExampleEntityList";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(command);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processCreate(_response);
        });
    }

    protected processCreate(response: Response): Promise<number> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 !== undefined ? resultData200 : <any>null;
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<number>(<any>null);
    }
}

export interface IHealthClient {
    get(): Promise<boolean>;
}

export class HealthClient extends ClientBase implements IHealthClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: AuthClient, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    get(): Promise<boolean> {
        let url_ = this.baseUrl + "/api/Health";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processGet(_response);
        });
    }

    protected processGet(response: Response): Promise<boolean> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 !== undefined ? resultData200 : <any>null;
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<boolean>(<any>null);
    }
}

export interface IRefillClient {
    create(command: CreateRefillCommand): Promise<number>;
    get(tankType?: TankType | undefined, tankNumber?: number | undefined, needle?: string | null | undefined, size?: number | undefined, skip?: number | null | undefined): Promise<PageResultOfRefillDto>;
}

export class RefillClient extends ClientBase implements IRefillClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: AuthClient, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    create(command: CreateRefillCommand): Promise<number> {
        let url_ = this.baseUrl + "/api/Refill";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(command);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processCreate(_response);
        });
    }

    protected processCreate(response: Response): Promise<number> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = resultData200 !== undefined ? resultData200 : <any>null;
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<number>(<any>null);
    }

    get(tankType?: TankType | undefined, tankNumber?: number | undefined, needle?: string | null | undefined, size?: number | undefined, skip?: number | null | undefined): Promise<PageResultOfRefillDto> {
        let url_ = this.baseUrl + "/api/Refill?";
        if (tankType === null)
            throw new Error("The parameter 'tankType' cannot be null.");
        else if (tankType !== undefined)
            url_ += "tankType=" + encodeURIComponent("" + tankType) + "&";
        if (tankNumber === null)
            throw new Error("The parameter 'tankNumber' cannot be null.");
        else if (tankNumber !== undefined)
            url_ += "tankNumber=" + encodeURIComponent("" + tankNumber) + "&";
        if (needle !== undefined && needle !== null)
            url_ += "needle=" + encodeURIComponent("" + needle) + "&";
        if (size === null)
            throw new Error("The parameter 'size' cannot be null.");
        else if (size !== undefined)
            url_ += "size=" + encodeURIComponent("" + size) + "&";
        if (skip !== undefined && skip !== null)
            url_ += "skip=" + encodeURIComponent("" + skip) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.processGet(_response);
        });
    }

    protected processGet(response: Response): Promise<PageResultOfRefillDto> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = PageResultOfRefillDto.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<PageResultOfRefillDto>(<any>null);
    }
}

export class CreateExampleEntityCommand implements ICreateExampleEntityCommand {
    name?: string | undefined;
    exampleEnum?: ExampleEnum;

    constructor(data?: ICreateExampleEntityCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
            this.exampleEnum = _data["exampleEnum"];
        }
    }

    static fromJS(data: any): CreateExampleEntityCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CreateExampleEntityCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        data["exampleEnum"] = this.exampleEnum;
        return data; 
    }
}

export interface ICreateExampleEntityCommand {
    name?: string | undefined;
    exampleEnum?: ExampleEnum;
}

export enum ExampleEnum {
    A = 0,
    B = 1,
    C = 2,
    D = 3,
}

export class UpdateExampleEntityCommand implements IUpdateExampleEntityCommand {
    id?: number;
    name?: string | undefined;
    exampleEnum?: ExampleEnum;
    exampleEntityListId?: number | undefined;

    constructor(data?: IUpdateExampleEntityCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.name = _data["name"];
            this.exampleEnum = _data["exampleEnum"];
            this.exampleEntityListId = _data["exampleEntityListId"];
        }
    }

    static fromJS(data: any): UpdateExampleEntityCommand {
        data = typeof data === 'object' ? data : {};
        let result = new UpdateExampleEntityCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["exampleEnum"] = this.exampleEnum;
        data["exampleEntityListId"] = this.exampleEntityListId;
        return data; 
    }
}

export interface IUpdateExampleEntityCommand {
    id?: number;
    name?: string | undefined;
    exampleEnum?: ExampleEnum;
    exampleEntityListId?: number | undefined;
}

export class PageResultOfExampleEntityDto implements IPageResultOfExampleEntityDto {
    newNeedle?: string | undefined;
    pagesRemaining?: number;
    results?: ExampleEntityDto[] | undefined;
    hasMore?: boolean;

    constructor(data?: IPageResultOfExampleEntityDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.newNeedle = _data["newNeedle"];
            this.pagesRemaining = _data["pagesRemaining"];
            if (Array.isArray(_data["results"])) {
                this.results = [] as any;
                for (let item of _data["results"])
                    this.results!.push(ExampleEntityDto.fromJS(item));
            }
            this.hasMore = _data["hasMore"];
        }
    }

    static fromJS(data: any): PageResultOfExampleEntityDto {
        data = typeof data === 'object' ? data : {};
        let result = new PageResultOfExampleEntityDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["newNeedle"] = this.newNeedle;
        data["pagesRemaining"] = this.pagesRemaining;
        if (Array.isArray(this.results)) {
            data["results"] = [];
            for (let item of this.results)
                data["results"].push(item.toJSON());
        }
        data["hasMore"] = this.hasMore;
        return data; 
    }
}

export interface IPageResultOfExampleEntityDto {
    newNeedle?: string | undefined;
    pagesRemaining?: number;
    results?: ExampleEntityDto[] | undefined;
    hasMore?: boolean;
}

export class ExampleEntityDto implements IExampleEntityDto {
    id?: number;
    name?: string | undefined;
    exampleEnum?: ExampleEnum;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;

    constructor(data?: IExampleEntityDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.name = _data["name"];
            this.exampleEnum = _data["exampleEnum"];
            this.createdAt = _data["createdAt"];
            this.updatedAt = _data["updatedAt"];
        }
    }

    static fromJS(data: any): ExampleEntityDto {
        data = typeof data === 'object' ? data : {};
        let result = new ExampleEntityDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        data["exampleEnum"] = this.exampleEnum;
        data["createdAt"] = this.createdAt;
        data["updatedAt"] = this.updatedAt;
        return data; 
    }
}

export interface IExampleEntityDto {
    id?: number;
    name?: string | undefined;
    exampleEnum?: ExampleEnum;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}

export class CreateExampleEntityListCommand implements ICreateExampleEntityListCommand {
    name?: string | undefined;

    constructor(data?: ICreateExampleEntityListCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
        }
    }

    static fromJS(data: any): CreateExampleEntityListCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CreateExampleEntityListCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        return data; 
    }
}

export interface ICreateExampleEntityListCommand {
    name?: string | undefined;
}

export class CreateRefillCommand implements ICreateRefillCommand {
    truckId?: number;
    tankType?: TankType;
    tankNumber?: number;
    startAmount?: number;
    endAmount?: number;
    couponNumber?: number;
    date?: Date;
    fuelType?: FuelType;
    tankState?: TankState;

    constructor(data?: ICreateRefillCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.truckId = _data["truckId"];
            this.tankType = _data["tankType"];
            this.tankNumber = _data["tankNumber"];
            this.startAmount = _data["startAmount"];
            this.endAmount = _data["endAmount"];
            this.couponNumber = _data["couponNumber"];
            this.date = _data["date"] ? new Date(_data["date"].toString()) : <any>undefined;
            this.fuelType = _data["fuelType"];
            this.tankState = _data["tankState"];
        }
    }

    static fromJS(data: any): CreateRefillCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CreateRefillCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["truckId"] = this.truckId;
        data["tankType"] = this.tankType;
        data["tankNumber"] = this.tankNumber;
        data["startAmount"] = this.startAmount;
        data["endAmount"] = this.endAmount;
        data["couponNumber"] = this.couponNumber;
        data["date"] = this.date ? this.date.toISOString() : <any>undefined;
        data["fuelType"] = this.fuelType;
        data["tankState"] = this.tankState;
        return data; 
    }
}

export interface ICreateRefillCommand {
    truckId?: number;
    tankType?: TankType;
    tankNumber?: number;
    startAmount?: number;
    endAmount?: number;
    couponNumber?: number;
    date?: Date;
    fuelType?: FuelType;
    tankState?: TankState;
}

export enum TankType {
    BUILDING = 0,
    SHIP = 1,
    TANK = 2,
}

export enum FuelType {
    OIL = 0,
    PETROLEUM = 1,
    GASOLINE = 2,
    OTHER = 3,
}

export enum TankState {
    EMPTY = 0,
    FULL = 1,
    PARTIALLY_FILLED = 2,
}

export class PageResultOfRefillDto implements IPageResultOfRefillDto {
    newNeedle?: string | undefined;
    pagesRemaining?: number;
    results?: RefillDto[] | undefined;
    hasMore?: boolean;

    constructor(data?: IPageResultOfRefillDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.newNeedle = _data["newNeedle"];
            this.pagesRemaining = _data["pagesRemaining"];
            if (Array.isArray(_data["results"])) {
                this.results = [] as any;
                for (let item of _data["results"])
                    this.results!.push(RefillDto.fromJS(item));
            }
            this.hasMore = _data["hasMore"];
        }
    }

    static fromJS(data: any): PageResultOfRefillDto {
        data = typeof data === 'object' ? data : {};
        let result = new PageResultOfRefillDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["newNeedle"] = this.newNeedle;
        data["pagesRemaining"] = this.pagesRemaining;
        if (Array.isArray(this.results)) {
            data["results"] = [];
            for (let item of this.results)
                data["results"].push(item.toJSON());
        }
        data["hasMore"] = this.hasMore;
        return data; 
    }
}

export interface IPageResultOfRefillDto {
    newNeedle?: string | undefined;
    pagesRemaining?: number;
    results?: RefillDto[] | undefined;
    hasMore?: boolean;
}

export class RefillDto implements IRefillDto {
    id?: number;
    date?: Date;
    couponId?: number;
    truckId?: number;
    startAmount?: number;
    endAmount?: number;

    constructor(data?: IRefillDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.date = _data["date"] ? new Date(_data["date"].toString()) : <any>undefined;
            this.couponId = _data["couponId"];
            this.truckId = _data["truckId"];
            this.startAmount = _data["startAmount"];
            this.endAmount = _data["endAmount"];
        }
    }

    static fromJS(data: any): RefillDto {
        data = typeof data === 'object' ? data : {};
        let result = new RefillDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["date"] = this.date ? this.date.toISOString() : <any>undefined;
        data["couponId"] = this.couponId;
        data["truckId"] = this.truckId;
        data["startAmount"] = this.startAmount;
        data["endAmount"] = this.endAmount;
        return data; 
    }
}

export interface IRefillDto {
    id?: number;
    date?: Date;
    couponId?: number;
    truckId?: number;
    startAmount?: number;
    endAmount?: number;
}

export interface FileResponse {
    data: Blob;
    status: number;
    fileName?: string;
    headers?: { [name: string]: any };
}

export class SwaggerException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isSwaggerException = true;

    static isSwaggerException(obj: any): obj is SwaggerException {
        return obj.isSwaggerException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new SwaggerException(message, status, response, headers, null);
}

/* istanbul ignore file */