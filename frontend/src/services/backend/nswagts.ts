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
    get(): Promise<ExampleEntitiesViewModel>;
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

    get(): Promise<ExampleEntitiesViewModel> {
        let url_ = this.baseUrl + "/api/ExampleEntity";
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

    protected processGet(response: Response): Promise<ExampleEntitiesViewModel> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = ExampleEntitiesViewModel.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ExampleEntitiesViewModel>(<any>null);
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

export class ExampleEntitiesViewModel implements IExampleEntitiesViewModel {
    exampleEntities?: ExampleEntityDto[] | undefined;

    constructor(data?: IExampleEntitiesViewModel) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            if (Array.isArray(_data["exampleEntities"])) {
                this.exampleEntities = [] as any;
                for (let item of _data["exampleEntities"])
                    this.exampleEntities!.push(ExampleEntityDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): ExampleEntitiesViewModel {
        data = typeof data === 'object' ? data : {};
        let result = new ExampleEntitiesViewModel();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        if (Array.isArray(this.exampleEntities)) {
            data["exampleEntities"] = [];
            for (let item of this.exampleEntities)
                data["exampleEntities"].push(item.toJSON());
        }
        return data; 
    }
}

export interface IExampleEntitiesViewModel {
    exampleEntities?: ExampleEntityDto[] | undefined;
}

export class ExampleEntityDto implements IExampleEntityDto {
    id?: number;
    name?: string | undefined;
    exampleEntityList?: ExampleEntityListDto | undefined;
    exampleEnum?: ExampleEnum;

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
            this.exampleEntityList = _data["exampleEntityList"] ? ExampleEntityListDto.fromJS(_data["exampleEntityList"]) : <any>undefined;
            this.exampleEnum = _data["exampleEnum"];
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
        data["exampleEntityList"] = this.exampleEntityList ? this.exampleEntityList.toJSON() : <any>undefined;
        data["exampleEnum"] = this.exampleEnum;
        return data; 
    }
}

export interface IExampleEntityDto {
    id?: number;
    name?: string | undefined;
    exampleEntityList?: ExampleEntityListDto | undefined;
    exampleEnum?: ExampleEnum;
}

export class ExampleEntityListDto implements IExampleEntityListDto {
    id?: number;
    name?: string | undefined;

    constructor(data?: IExampleEntityListDto) {
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
        }
    }

    static fromJS(data: any): ExampleEntityListDto {
        data = typeof data === 'object' ? data : {};
        let result = new ExampleEntityListDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["name"] = this.name;
        return data; 
    }
}

export interface IExampleEntityListDto {
    id?: number;
    name?: string | undefined;
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