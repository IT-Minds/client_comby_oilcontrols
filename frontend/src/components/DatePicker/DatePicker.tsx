import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.module.css";

import React from "react";
import ReactDatePicker from "react-datepicker";

interface Props {
  isClearable?: boolean;
  onChange: (date: Date) => void;
  selectedDate: Date | null;
  showPopperArrow?: boolean;
}

const DatePicker = ({
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
