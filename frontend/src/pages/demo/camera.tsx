import { Container, VStack } from "@chakra-ui/react";
import CameraComp from "components/Camera/CameraComponent";
import { Locale } from "i18n/Locale";
import { GetStaticProps, NextPage } from "next";
import { I18nProps } from "next-rosetta";
import { useState } from "react";

const DemoPage: NextPage = () => {
  const [imgSource, setImgSource] = useState(null);

  return (
    <Container maxW="xl" centerContent>
      <VStack>
        <CameraComp imgSource={setImgSource} />
        {imgSource && <img src={imgSource} alt=""></img>}
      </VStack>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<I18nProps<Locale>> = async context => {
  const locale = context.locale || context.defaultLocale;

  const { table = {} } = await import(`../../i18n/${locale}`);
  return { props: { table } };
};

export default DemoPage;
