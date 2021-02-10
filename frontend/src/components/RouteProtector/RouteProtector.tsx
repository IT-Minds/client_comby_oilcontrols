import { VisuallyHidden } from "@chakra-ui/react";
import { UserTypeContext } from "contexts/UserTypeContext";
import { useRouter } from "next/router";
import { FC, useContext, useEffect } from "react";
import { Action } from "services/backend/nswagts";
import { UserType } from "types/UserType";

const localePattern = /^(\/[a-z]{2}-[A-Z]{2})?/;
const eolPattern = /(\/?\?.*)?$/;

const matchWithLocale = (route: string) =>
  new RegExp(localePattern.source + route + eolPattern.source);

const matchMyTruck = matchWithLocale("/mytruck" + /(\/(\[id\]|\d+))?/.source);

const RouteProtector: FC = () => {
  const { activeUser } = useContext(UserTypeContext);

  const router = useRouter();

  useEffect(() => {
    const handler = (newUrl: string) => {
      const isMyTruck = matchMyTruck.test(newUrl);
      if (activeUser.truckId && !isMyTruck) {
        router.events.emit("routeChangeError");
        throw "Ignore this error 1";
      } else if (!activeUser.truckId && isMyTruck) {
        router.events.emit("routeChangeError");
        throw "Ignore this error 2";
      }
    };
    router.events.on("routeChangeStart", handler);

    const isMyTruck = matchMyTruck.test(router.pathname);
    if (activeUser.truckId && !isMyTruck) {
      router.push("/mytruck");
    } else if (!activeUser.truckId && isMyTruck) {
      router.push("/");
    }
    return () => {
      router.events.off("routeChangeStart", handler);
    };
  }, []);

  return (
    <VisuallyHidden>Route is protected: {activeUser.truckId ? "true" : "false"}</VisuallyHidden>
  );
};

export default RouteProtector;
