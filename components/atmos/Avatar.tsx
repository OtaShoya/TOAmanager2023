import { Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Socket } from "socket.io-client";

type PropsType = {
  imgLabel: string;
  imgUrl: string;
  loginId: string;
  socket: Socket;
};

const LoginAvatar = ({ imgLabel, imgUrl, loginId, socket }: PropsType) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    socket.emit("logout", localStorage.getItem("sessionID"));
    localStorage.removeItem("sessionID");
    location.href = "/";
  };
  return (
    <div className="flex flex-row items-center space-x-6">
      <label className="text-white text-xl">{loginId}</label>
      <button onClick={handleClick}>
        <Avatar alt={imgLabel} src={imgUrl} sx={{ width: 56, height: 56 }} />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="flex justify-center mb-5">
          <Avatar alt={imgLabel} src={imgUrl} sx={{ width: 56, height: 56 }} />
        </div>
        <MenuItem>
          <button onClick={logout}>ログオフ</button>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LoginAvatar;
