import { Helmet } from "react-helmet-async";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import { Link } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes";

const SignupForm = () => {
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
    console.log(values);
  };

  return (
    <>
      <Helmet>
        <title>Sign up | Snapgram</title>
      </Helmet>
      <div className="flex w-96 flex-col items-center gap-5 px-5">
        <img src="/assets/images/logo.svg" alt="logo" className="mb-8" />
        <h2 className="h2-bold text-center">Create a new account</h2>
        <p className="base-regular text-center text-light-3">
          To use snapgram. Please enter your details.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 flex w-full flex-col items-center gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="medium-base">Username</FormLabel>
                  <FormControl>
                    <Input className="shadcn-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="medium-base">name</FormLabel>
                  <FormControl>
                    <Input className="shadcn-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="medium-base">Email</FormLabel>
                  <FormControl>
                    <Input className="shadcn-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="medium-base">Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shadcn-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shadcn-btn w-full">
              Sign up
            </Button>
          </form>
        </Form>
        <p className="small-regular">
          Do you have an account?{" "}
          <Link to={AUTH_ROUTES.SIGN_IN} className="text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default SignupForm;
