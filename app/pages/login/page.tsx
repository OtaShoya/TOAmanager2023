"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const sessions = require("@/src/lib/sessions");

let socket: Socket;

export const theme = createTheme({
  palette: {
    primary: { main: "#556593" },
  },
});

export type LoginProps = {
  loginId: string;
  password: string;
};

const Login = () => {
  const [error, setError] = useState("");
  const { control, handleSubmit } = useForm<LoginProps>({
    defaultValues: { loginId: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginProps> = (data: LoginProps) => {
    console.log(data);

    socket.emit("login", {
      user: data.loginId,
      password: data.password,
    });
  };

  useEffect(() => {
    socket = sessions.connectSession();

    sessions.socketInitializer(socket);

    socket.on("session_found", (msg) => {
      if (msg === true) location.href = "/pages/top";
    });

    socket.on("logged", (msg) => {
      if (msg === true) {
        location.href = "/pages/top";
      } else {
        setError("ログインIDまたはパスワードが間違っています");
      }
    });
  }, []);

  return (
    <main>
      <div className="flex flex-row">
        <div className="basis-1/2 h-screen max-h-screen bg-[#556593] flex justify-center items-center">
          {/* 画像配置 */}
          <Image
            src="/TOA manager.png"
            alt=""
            width={960}
            height={1080}
            priority
          />
        </div>
        <div className="basis-1/2 h-screen justify-center items-center flex flex-col">
          {/* ログインフォーム*/}
          <h1 className="text-[#556593] text-8xl mb-20 font-bold">Login</h1>
          <div className="text-rose-600">{error}</div>
          <ThemeProvider theme={theme}>
            <form className="flex flex-col space-y-4 mt-5">
              <Controller
                name="loginId"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="ログインID" color="primary" />
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="パスワード"
                    type="password"
                    color="primary"
                  />
                )}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={handleSubmit(onSubmit)}
              >
                Login
              </Button>
            </form>
          </ThemeProvider>
        </div>
      </div>
    </main>
  );
};
export default Login;
