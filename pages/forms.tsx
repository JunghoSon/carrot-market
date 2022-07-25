import { FieldErrors, useForm } from "react-hook-form";

interface LoginForm {
  username: string;
  email: string;
  password: string;
}

export default function Forms() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    resetField,
    setError,
    watch,
  } = useForm<LoginForm>({ mode: "onBlur" });
  const onValid = (data: LoginForm) => {
    console.log(data);
    setError("username", { message: "Aleady exist" });
    reset();
    resetField("password");
  };
  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };
  setValue("username", "abc");
  console.log(watch);
  console.log(watch("username"));
  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input
        {...register("username", {
          required: "username is rquired",
          minLength: {
            message: "The username should be longer than 5 chars.",
            value: 5,
          },
        })}
        type="text"
        placeholder="username"
      />
      <input
        {...register("email", {
          required: "email is rquired",
          validate: {
            notGmail: (value) =>
              !value.includes("@gmail.com") || "Gmail is not allowed",
          },
        })}
        type="text"
        placeholder="email"
      />
      {errors.email?.message}
      <input
        {...register("password", {
          required: true,
        })}
        type="password"
        placeholder="passowrd"
      />
      <input type="submit" value="Create Account" />
    </form>
  );
}
