import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Stack
} from "@chakra-ui/react";
import { FC } from "react";

import styles from "./styles.module.css";

type Props = {
  carId: string;
  locations: string[];
  couponNumbers: string[];
  fillType: string[];
};

const ReportingComp: FC<Props> = ({ locations, couponNumbers, fillType }) => {
const ReportingComp: FC<Props> = ({ carId, locations, couponNumbers, fillType }) => {
  return (
    <Stack>
      <form>
        <FormControl id="car-id">
          <FormLabel>Car id.</FormLabel>
          <Input type="text" isReadOnly isDisabled value={carId} />
        </FormControl>

        <FormControl id="location">
          <FormLabel>Select location:</FormLabel>
          <Select placeholder="Select location">
            {locations.map(path => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="coupon-number">
          <FormLabel>Select coupon number:</FormLabel>
          <Select>
            {couponNumbers.map(path => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="fill-number">
          <FormLabel>Select fill type:</FormLabel>
          <Select>
            {fillType.map(path => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="first-name" isRequired>
          <FormLabel>Amount filled:</FormLabel>
          <Input placeholder="Enter amount in liters" />
        </FormControl>

        <FormControl id="special-fill">
          <FormLabel>Is special fill:</FormLabel>
          <Checkbox></Checkbox>
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">
          Submit
        </Button>
      </form>
    </Stack>
  );
};

export default ReportingComp;
