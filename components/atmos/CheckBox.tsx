import { Checkbox } from "@material-tailwind/react";

type PropsType = {
  label: string;
  onchange: any;
};

const CheckBox = ({ label, onchange }: PropsType) => {
  return (
    <div className="flex items-center">
      <Checkbox
        color="blue"
        className="border rounded-md w-7 h-7"
        onChange={onchange}
      />
      <label className="text-white text-2xl font-semibold">{label}</label>
    </div>
  );
};

export default CheckBox;
