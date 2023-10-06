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

type PropType = {
  title: string;
  subTitles: SubTitleType[];
  label: string;
};

type SubTitleType = {
  tabTitle: string;
  url: string;
};

const Navigation = ({ subTitles, label }: PropType) => {
  const router = useRouter();

  const clickHandler = (url: string) => {
    router.push(url);
  };

  const logout = () => {
    router.push("/");
  };

  return (
    <div className="border-r border-black/12 w-full h-full">
      <CssBaseline />
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
    </div>
  );
};

export default Navigation;
