"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@/store/slice/authSlice";
import { useSnackbar } from "notistack";

export interface LoginValues {
  email: string;
  password: string;
}

export const useLogin = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (
    values: LoginValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setLoading(true);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        enqueueSnackbar(data.error, {
          variant: "error",
        });
      } else {
        enqueueSnackbar("Login Success!", { variant: "success" });
        document.cookie = `token=${data.token}; path=/; max-age=3600`;
        dispatch(loginAction());
        window.location.href = "/dashboard";
      }
    } catch (err) {
      enqueueSnackbar("Server error", {
        variant: "error",
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return { handleLogin, loading };
};
