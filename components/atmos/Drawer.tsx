"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { Socket } from "socket.io-client";

const drawerWidth = 300;

type PropType = {
  title: string;
  subTitles: SubTitleType[];
  label: string;
  socket: Socket;
};

type SubTitleType = {
  tabTitle: string;
  url: string;
};

const Navigation = ({ title, subTitles, label, socket }: PropType) => {
  const router = useRouter();

  const clickHandler = (url: string) => {
    router.push(url);
  };

  const logout = () => {
    socket.emit("logout", localStorage.getItem("sessionID"))
    localStorage.removeItem("sessionID");
    router.push("/");
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {subTitles.map((subTitle, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => clickHandler(subTitle.url)}>
                <ListItemText primary={subTitle.tabTitle} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Button variant="text" onClick={logout}>
          {label}
        </Button>
      </Drawer>
    </>
  );
};

export default Navigation;
