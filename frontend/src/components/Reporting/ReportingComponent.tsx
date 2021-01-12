import { Button, Checkbox, FormControl, FormLabel, Input, Select, Stack } from "@chakra-ui/react";
import { FC, useCallback, useState } from "react";
import DropdownType from "types/DropdownType";

import { ReportForm } from "./ReportForm";
import styles from "./styles.module.css";

type Props = {
  submitCallback: (reportForm: ReportForm) => void;
  carId: string;
  locations: DropdownType[];
  couponNumbers: DropdownType[];
  fillTypes: DropdownType[];
};

const ReportingComp: FC<Props> = ({
  submitCallback,
  carId,
  locations,
  couponNumbers,
  fillTypes
}) => {
  const [localReportForm, setLocalReportForm] = useState<ReportForm>({
    carId,
    liters: "",
    fillTypeId: "",
    couponId: "",
    locationId: "",
    isSpecialFill: false
  });

  const updateLocalForm = (event: any, key: keyof ReportForm) => {
    setLocalReportForm((x: Record<keyof ReportForm, any>) => {
      x[key] = key == "isSpecialFill" ? event.target.checked : event.target.value;
      return x;
    });
  };

  const handleSubmit = useCallback((event: any) => {
    submitCallback(localReportForm);
    event.preventDefault();
  }, []);

  return (
    <Stack>
      <form onSubmit={handleSubmit}>
        <FormControl id="car-id">
          <FormLabel>Car id:</FormLabel>
          <Input type="text" isReadOnly isDisabled value={carId} />
        </FormControl>

        <FormControl id="location" isRequired>
          <FormLabel>Select location:</FormLabel>
          <Select placeholder="Select location" onChange={e => updateLocalForm(e, "locationId")}>
            {locations.map(path => (
              <option key={path.id} value={path.id}>
                {path.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="coupon-number">
          <FormLabel>Select coupon number:</FormLabel>
          <Select onChange={e => updateLocalForm(e, "couponId")}>
            {couponNumbers.map(path => (
              <option key={path.id} value={path.id}>
                {path.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="fill-number">
          <FormLabel>Select fill type:</FormLabel>
          <Select onChange={e => updateLocalForm(e, "fillTypeId")}>
            {fillTypes.map(path => (
              <option key={path.id} value={path.id}>
                {path.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl id="amount-filled" isRequired>
          <FormLabel>Amount filled:</FormLabel>
          <Input
            placeholder="Enter amount in liters"
            onChange={e => updateLocalForm(e, "liters")}
          />
        </FormControl>

        <FormControl id="special-fill">
          <FormLabel>Is special fill:</FormLabel>
          <Checkbox onChange={e => updateLocalForm(e, "isSpecialFill")}></Checkbox>
        </FormControl>

        <Button mt={4} colorScheme="teal" type="submit">
          Submit
        </Button>
      </form>
    </Stack>
  );
};

export default ReportingComp;
