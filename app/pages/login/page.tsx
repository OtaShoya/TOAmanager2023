"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/navigation";

export const theme = createTheme({
  palette: {
    primary: { main: "#4f46e5" },
  },
});

interface IFormInput {
  loginId: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<IFormInput>({
    defaultValues: { loginId: "", password: "" },
  });

  let result: boolean = false;

  const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
    console.log(data);
    result = true;
    if (result) {
      router.push("/pages/top");
    } else {
      router.push("/");
    }
  };

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
