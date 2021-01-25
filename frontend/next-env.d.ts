/// <reference types="next" />
/// <reference types="next/types/global" />

export declare global {
  interface Window {
    workbox: Workbox;
    showOpenFilePicker(opt?: FilePickerOptions): PromiseLike<FileSystemFileHandle[]>;
  }

  interface FileSystemFileHandle {
    getFile(): PromiseLike<File>;
    createWritable(): unknown;
  }

  interface FilePickerOptions {
    multiple?: boolean;
    excludeAcceptAllOption?: boolean;
    types?: {
      description: string;
      accept: Record<string, string[]>;
    }[];
  }

  //Typing fixes due to WorkBox not being standard in TypeScript as of Dec. 2020
  class Workbox {
    constructor(scriptURL: string, registerOptions?: Record<string, unknown>);

    register(immediate?: boolean): Promise<unknown>;
    active(): Promise<ServiceWorker>;
    controlling(): Promise<ServiceWorker>;
    getSW(): Promise<ServiceWorker>;
    messageSW(data: Record<string, unknown>): Promise<Record<string, unknown>>;

    addEventListener(event: "message", callback: (data: IWorkboxEventMessage) => void): void;
    addEventListener(event: "installed", callback: (data: IWorkboxEvent) => void): void;
    addEventListener(event: "waiting", callback: (data: IWorkboxEventWaiting) => void): void;
    addEventListener(event: "controlling", callback: (data: IWorkboxEvent) => void): void;
    addEventListener(event: "activated", callback: (data: IWorkboxEvent) => void): void;
    addEventListener(event: "redundant", callback: (data: IWorkboxEvent) => void): void;
    addEventListener(
      event: "externalinstalled",
      callback: (data: IWorkboxEventExternal) => void
    ): void;
    addEventListener(
      event: "externalwaiting",
      callback: (data: IWorkboxEventExternal) => void
    ): void;
    addEventListener(
      event: "externalactivated",
      callback: (data: IWorkboxEventExternal) => void
    ): void;
  }

  type WorkboxEvent =
    | "message"
    | "installed"
    | "waiting"
    | "controlling"
    | "activated"
    | "redundant"
    | "externalinstalled"
    | "externalwaiting"
    | "externalactivated";

  interface IWorkboxEventBase {
    originalEvent: Event;
    type: WorkboxEvent;
    target: Workbox;
  }

  interface IWorkboxEventMessage extends IWorkboxEventBase {
    data: unknown;
  }

  interface IWorkboxEvent extends IWorkboxEventBase {
    sw: ServiceWorker;
    isUpdate: boolean | undefined;
  }

  interface IWorkboxEventWaiting extends IWorkboxEvent {
    wasWaitingBeforeRegister: boolean | undefined;
  }

  interface IWorkboxEventExternal extends IWorkboxEventBase {
    sw: ServiceWorker;
  }
}
