import "ts-array-ext/reduceAsync";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import ListReduce, { ListReducerActionType } from "react-list-reducer";
import { genHealthClient } from "services/backend/apiClients";

type Callback = () => Promise<unknown>;
type SavedCallback = {
  id: string;
  cb: Callback;
};

type Return = {
  awaitCallback: (cb: Callback, id: string) => void;
  isOnline: boolean;
};

export const useOffline = (): Return => {
  const [isOnline, setIsOnline] = useState(false);
  const isOnlineRef = useRef(false);
  const [savedCallbacks, dispatchCallbacks] = useReducer(ListReduce<SavedCallback>("id"), []);

  useEffect(() => {
    const setOnlineEvent = (val: boolean) => () => {
      setIsOnline(val);
    };

    if (process.browser || window) {
      window.addEventListener("online", setOnlineEvent(true));
      window.addEventListener("offline", setOnlineEvent(false));
      window.addEventListener("load", setOnlineEvent(true));
    }

    (async () => {
      const client = genHealthClient();
      const online = await client.get().catch(() => false);
      setIsOnline(online);
    })();

    return () => {
      if (process.browser || window) {
        window.removeEventListener("online", setOnlineEvent(true));
        window.removeEventListener("offline", setOnlineEvent(false));
        window.removeEventListener("load", setOnlineEvent(true));
      }
    };
  }, []);

  useEffect(() => {
    if (!isOnlineRef.current && isOnline) {
      // just went online, execute all awaiting calls

      Promise.allSettled(savedCallbacks.map(savedCallback => savedCallback.cb())).then(() =>
        dispatchCallbacks({
          type: ListReducerActionType.Reset,
          data: []
        })
      );
    }

    isOnlineRef.current = isOnline;
  }, [isOnline, savedCallbacks]);

  const awaitCallback = useCallback((cb: Callback, id: string) => {
    if (isOnlineRef.current) cb();
    dispatchCallbacks({
      type: ListReducerActionType.AddOrUpdate,
      data: {
        id,
        cb
      }
    });
  }, []);

  return { awaitCallback, isOnline };
};
