import { Circle } from "@chakra-ui/react";
import { FC } from "react";
import { MdPerson } from "react-icons/md";
import { IUserIdDto } from "services/backend/nswagts";

type Props = {
  size?: number;
  user: IUserIdDto;
};

const UserCircle: FC<Props> = ({ size = 12, user }) => {
  return (
    <Circle bgColor={toColor(user?.id)} width={size} height={size} p={1}>
      <MdPerson size={"100%"} color="white" />
    </Circle>
  );
};

export default UserCircle;

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

function toColor(num: number) {
  return options[num % options.length];
}
