import { VisuallyHidden } from "@chakra-ui/react";
import { UserTypeContext } from "contexts/UserTypeContext";
import { useRouter } from "next/router";
import { FC, useContext, useEffect } from "react";
import { UserType } from "types/UserType";

const localePattern = /^(\/[a-z]{2}-[A-Z]{2})?/;
const eolPattern = /(\/?\?.*)?$/;

const matchWithLocale = (route: string) =>
  new RegExp(localePattern.source + route + eolPattern.source);

const matchMyTruck = matchWithLocale("/mytruck" + /(\/(\[id\]|\d+))?/.source);

const RouteProtector: FC = () => {
  const { isType } = useContext(UserTypeContext);

  const router = useRouter();

  useEffect(() => {
    const handler = (newUrl: string) => {
      const isMyTruck = matchMyTruck.test(newUrl);
      if (isType(UserType.DRIVER) && !isMyTruck) {
        router.events.emit("routeChangeError");
        throw "Ignore this error 1";
      } else if (isType(UserType.OFFICE_WORKER) && isMyTruck) {
        router.events.emit("routeChangeError");
        throw "Ignore this error 2";
      }
    };
    router.events.on("routeChangeStart", handler);

    const isMyTruck = matchMyTruck.test(router.pathname);
    if (isType(UserType.DRIVER) && !isMyTruck) {
      router.push("/mytruck");
    } else if (isType(UserType.OFFICE_WORKER) && isMyTruck) {
      router.push("/");
    }
    return () => {
      router.events.off("routeChangeStart", handler);
    };
  }, [isType]);

  return (
    <VisuallyHidden>
      Route is protected: {isType(UserType.DRIVER) ? "true" : "false"}
    </VisuallyHidden>
  );
};

export default RouteProtector;
