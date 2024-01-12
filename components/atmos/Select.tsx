import { useState } from "react";
import Select from "react-select";

const menbers = [
  { value: 1, label: "太田翔哉" },
  { value: 2, label: "チアゴ" },
];

const UserSelect = () => {
  const [selectedValue, setSelectedValue] = useState(menbers);

  return (
    <Select
      options={menbers}
      defaultValue={selectedValue}
      onChange={(value) => {
        value ? setSelectedValue([...value]) : null;
      }}
      isMulti
    />
  );
};

export default UserSelect;
