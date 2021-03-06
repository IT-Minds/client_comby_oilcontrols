import "react-datepicker/dist/react-datepicker.css";

import React, { FC } from "react";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";

interface Props {
  isClearable?: boolean;
  onChange: (date: Date) => void;
  selectedDate: Date | null;
  showPopperArrow?: boolean;
}

const DatePicker: FC<Props & Partial<ReactDatePickerProps>> = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  ...props
}: Props) => {
  return (
    <ReactDatePicker
      selected={selectedDate}
      onChange={onChange}
      isClearable={isClearable}
      showPopperArrow={showPopperArrow}
      {...props}
    />
  );
};

export default DatePicker;
