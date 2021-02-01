import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LocalePage: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/mytruck/[id]", "/mytruck/1");
  }, []);

  return <h1>Rest of the page</h1>;
};

export default LocalePage;
