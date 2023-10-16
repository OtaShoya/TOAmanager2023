"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";

const sessions = require("@/src/lib/sessions");

let socket: Socket;

export const theme = createTheme({
  palette: {
    primary: { main: "#4f46e5" },
  },
});

export type LoginProps = {
  loginId: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
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
        <div className="basis-1/2 h-screen max-h-screen bg-indigo-600">
          {/* 画像配置 */}
        </div>
        <div className="basis-1/2 h-screen flex justify-center items-center flex flex-col space-y-2">
          {/* ログインフォーム*/}
          <h1 className="text-indigo-600 text-8xl mb-20 font-bold">Login</h1>
          <ThemeProvider theme={theme}>
            <form className="flex flex-col space-y-2">
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
                  <TextField {...field} label="パスワード" color="primary" />
                )}
              />
              <div className="text-rose-600">{error}</div>
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
