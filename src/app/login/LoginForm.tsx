"use client";
import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLogin } from "@/hooks/useLogin";
import { LoginSchema } from "@/lib/schemas/LoginSchema";

interface LoginValues {
  email: string;
  password: string;
}

const initialValues: LoginValues = { email: "", password: "" };

const LoginForm: React.FC = () => {
  const { handleLogin, loading } = useLogin();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={(
        values: LoginValues,
        { setSubmitting }: FormikHelpers<LoginValues>
      ) => handleLogin(values, setSubmitting)}
    >
      {({ values, errors, touched, handleChange }) => (
        <Form className="space-y-4">
          <p className="text-4xl text-gray-800 mb-4">Sign Up</p>
          <p className="text-[#9e9e9e] font-light text-sm text-pretty mb-6 self-end text-left">
            Access your account to manage and oversee all logistics operations
            efficiently.
          </p>

          <Input
            label="Email"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange("email")}
            error={touched.email ? errors.email : undefined}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange("password")}
            error={touched.password ? errors.password : undefined}
          />

          <Button
            type="submit"
            text={loading ? "Logging in..." : "Login"}
            loading={loading}
            className=""
          />
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
