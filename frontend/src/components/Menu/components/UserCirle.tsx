import { Circle } from "@chakra-ui/react";
import { UserTypeContext } from "contexts/UserTypeContext";
import { FC, useContext } from "react";
import { MdPerson } from "react-icons/md";

type Props = {
  size?: number;
};

const UserCirle: FC<Props> = ({ size = 12 }) => {
  const { activeUser } = useContext(UserTypeContext);

  return (
    <Circle bgColor={toColor(activeUser.id)} width={size} height={size} p={1}>
      <MdPerson size={"100%"} color="white" />
    </Circle>
  );
};

export default UserCirle;

function toColor(num: number) {
  const options = [
    "orange.500",
    "yellow.500",
    "green.500",
    "teal.500",
    "purple.500",
    "blue.500",
    "pink.500",
    "red.500",
    "cyan.500"
  ];

  return options[num % options.length];
}
