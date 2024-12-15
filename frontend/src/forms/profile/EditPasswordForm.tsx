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
import { EditPasswordFormValidation, EditPasswordType } from "@/lib/validation";
import Spinner from "@/components/ui/Spinner";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthProvider";

const EditPasswordForm = () => {
  const { user, updatePassword } = useAuth();

  const form = useForm<z.infer<typeof EditPasswordFormValidation>>({
    resolver: zodResolver(EditPasswordFormValidation),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  // This is demo
  const handleForgotPassword = () => {
    toast({
      title: "Change Password",
      description: `The password change link was sent to ${user?.email}.`,
    });
  };

  const onSubmit = async (values: EditPasswordType) => {
    await updatePassword(values);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 flex w-full flex-col items-center gap-9">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    className="shadcn-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className="shadcn-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="new_password_confirmation"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className="shadcn-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button onClick={handleForgotPassword} type="button" variant="link">
              Forgot your password ?
            </Button>
            <Button
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              type="submit">
              {form.formState.isSubmitting ? <Spinner /> : "Update Password"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditPasswordForm;
