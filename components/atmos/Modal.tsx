// ↓ 2023-1013 create page

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type PropsType = {
  text: string;
  label1: string;
  label2: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  doAction: ()=>void;
};

const BasicModal = ({ text, label1, label2, open, setOpen, doAction }: PropsType) => {
  const handleClose = () => setOpen(false);
  return (
    <div>
      <Modal open={open}>
        <Box sx={style}>
          <div>{text}</div>
          <div className="flex space-x-4 mt-4">
            {/*↓キャンセルボタン*/}
            <button className="border hover:bg-slate-100" onClick={handleClose}>
              {label1}
            </button>
            {/*↓削除ボタン*/}
            <button className="border hover:bg-slate-100" onClick={doAction}>{label2}</button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default BasicModal;
