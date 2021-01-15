import { Box, Container, Text, useColorModeValue } from "@chakra-ui/react";
import { readdirSync } from "fs";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { join } from "path";

type Props = {
  paths: string[];
};

const IndexPage: NextPage<Props> = ({ paths }) => {
  const bg = useColorModeValue("gray.100", "gray.700");

  return (
    <Container maxW="xl" centerContent>
      <Box padding="4" bg={bg} maxW="3xl" maxH="xl" resize="both" overflow="auto">
        Here is a list of all demo-able components. You are able to resize this box as you see fit
        to test the responsiveness of the design. You need to manually go back to this page from
        each demo component.
        {paths.map(path => (
          <Text color="blue.400" key={path}>
            <Link href={"/demo/" + path}>
              <a>{path} </a>
            </Link>
          </Text>
        ))}
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const startPath = join(process.cwd(), "src", "pages", "demo");

  const files = readdirSync(startPath)
    .filter(x => !/^index\.tsx$/.test(x))
    .map(x => /^(\w+)\.tsx$/.exec(x)[1]);

  return {
    props: {
      paths: files
    }
  };
};

export default IndexPage;
