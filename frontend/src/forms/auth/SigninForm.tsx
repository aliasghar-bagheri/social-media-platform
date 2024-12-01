import { Helmet } from "react-helmet-async";

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
import { SigninSchemaType, SigninValidation } from "@/lib/validation";
import { Link } from "react-router-dom";
import { AUTH_ROUTES } from "@/routes";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthProvider";

const SigninForm = () => {
  const { signin } = useAuth();

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: SigninSchemaType) => {
    await signin(values);
  };

  return (
    <>
      <Helmet>
        <title>Sign in | Snapgram</title>
      </Helmet>
      <div className="flex w-96 flex-col items-center gap-5 px-5">
        <img src="/assets/images/logo.svg" alt="logo" className="mb-8" />
        <h2 className="h2-bold text-center">Login in to your account</h2>
        <p className="base-regular text-center text-light-3">
          Welcome back! Please enter your details.
        </p>

        <fieldset className="w-full" disabled={form.formState.isSubmitting}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 flex w-full flex-col items-center gap-4">
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
              <Button
                disabled={!form.formState.isValid}
                type="submit"
                className="shadcn-btn w-full">
                {form.formState.isSubmitting ? <Spinner /> : "Sign in"}
              </Button>
            </form>
          </Form>
        </fieldset>
        <p className="small-regular">
          Don't have an account ?{" "}
          <Link to={AUTH_ROUTES.SIGN_UP} className="text-primary-500">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default SigninForm;
