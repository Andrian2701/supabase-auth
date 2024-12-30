"use client";
import { signup } from "@/services/auth";
import { Auth } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(15, "Password cannot exceed 15 characters"),
});

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Auth>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit: SubmitHandler<Auth> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const res = await signup(data);

      if (!res.success) {
        setError(res.message);
      }
    } catch (err) {
      setError("Cannot sign up, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-10 py-4 border-[1px] border-gray rounded-md bg-white flex flex-col justify-center items-center gap-2 h-[250px]"
    >
      <h1 className="text-black">Signup</h1>
      <input
        type="email"
        placeholder="email"
        className="text-black px-2"
        {...register("email")}
      />
      {errors.email && (
        <span className="text-red-500 text-sm">{errors.email.message}</span>
      )}
      <input
        type="password"
        placeholder="password"
        className="text-black px-2"
        {...register("password")}
      />
      {errors.password && (
        <span className="text-red-500 text-sm">{errors.password.message}</span>
      )}
      <button
        className="bg-black rounded-md w-full"
        type="submit"
        disabled={loading}
      >
        {loading ? "Proccessing..." : "Signup"}
      </button>
      {error && <span className="text-red-500">{error}</span>}
    </form>
  );
};

export default SignupForm;
