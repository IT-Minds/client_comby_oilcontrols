import { useEffect } from "react";
import { logger } from "utils/logger";

export const usePWA = (): void => {
  // This hook only run once in browser after the component is rendered for the first time.
  // It has same effect as the old componentDidMount lifecycle callback.
  useEffect(() => {
    if (process.browser && "serviceWorker" in navigator && window?.workbox !== undefined) {
      const wb = window.workbox;
      // add event listeners to handle any of PWA lifecycle event
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
      wb.addEventListener("installed", event => {
        logger.debug(`Event ${event.type} is triggered.`, event);
      });

      wb.addEventListener("controlling", event => {
        logger.debug(`Event ${event.type} is triggered.`, event);
      });

      wb.addEventListener("activated", event => {
        logger.debug(`Event ${event.type} is triggered.`, event);
      });

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = (event: IWorkboxEventWaiting | IWorkboxEventExternal) => {
        // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.
        if ((event as IWorkboxEventWaiting).wasWaitingBeforeRegister) {
          logger.debug("wasWaitingBeforeRegister");
        }

        if (confirm("A newer version of this web app is available, reload to update?")) {
          wb.addEventListener("controlling", () => {
            window.location.reload();
          });

          // Send a message to the waiting service worker, instructing it to activate.
          wb.messageSW({ type: "SKIP_WAITING" });
        } else {
          logger.debug(
            "User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time."
          );
        }
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);
      wb.addEventListener("externalwaiting", promptNewVersionAvailable);

      // ISSUE - this is not working as expected, why?
      // I could only make message event listenser work when I manually add this listenser into sw.js file
      wb.addEventListener("message", event => {
        logger.debug(`Event ${event.type} is triggered.`, event);
      });

      /*
      wb.addEventListener('redundant', event => {
        logger.debug(`Event ${event.type} is triggered.`, event)
      })
      wb.addEventListener('externalinstalled', event => {
        logger.debug(`Event ${event.type} is triggered.`, event)
      })
      wb.addEventListener('externalactivated', event => {
        logger.debug(`Event ${event.type} is triggered.`, event)
      })
      */

      // never forget to call register as auto register is turned off in next.config.js
      wb.register();
    }
  }, []);
};

//Typing fixes due to WorkBox not being standard in TypeScript as of Dec. 2020
declare global {
  interface Window {
    workbox: Workbox;
  }
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
