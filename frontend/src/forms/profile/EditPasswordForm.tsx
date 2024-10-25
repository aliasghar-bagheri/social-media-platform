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

type EditPasswordFormProps = {
  handleEditPassword: (data: EditPasswordType) => void;
  handleForgotPassword: () => void;
};

const EditPasswordForm = ({
  handleEditPassword,
  handleForgotPassword,
}: EditPasswordFormProps) => {
  const form = useForm<z.infer<typeof EditPasswordFormValidation>>({
    resolver: zodResolver(EditPasswordFormValidation),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof EditPasswordFormValidation>) => {
    handleEditPassword(values);
    console.log(values);
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
            name="confirm_new_password"
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
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditPasswordForm;
