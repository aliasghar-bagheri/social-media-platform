import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditProfileFormValidation, EditProfileType } from "@/lib/validation";

import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SubmitButton from "@/components/ui/SubmitButton";

const EditProfileForm = () => {
  const { user: initialData, editUser } = useAuth();

  const [preview, setPreview] = useState<string | undefined>(initialData?.profile);

  const form = useForm<EditProfileType>({
    resolver: zodResolver(EditProfileFormValidation),
    mode: "onChange",
    defaultValues: {
      profile: initialData?.profile || "",
      name: initialData?.name || "",
      username: initialData?.username || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      bio: initialData?.bio || "",
    },
  });

  const profileFile = form.watch("profile");

  useEffect(() => {
    if (profileFile instanceof File) {
      const objectUrl = URL.createObjectURL(profileFile);
      setPreview(objectUrl);
      // Cleanup
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [profileFile]);

  const onSubmit = async (values: EditProfileType) => {
    await editUser(values);
  };

  return (
    <fieldset disabled={form.formState.isSubmitting}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 flex w-full flex-col items-end gap-9">
          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-full ring-1 ring-primary-500">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={preview} />
                        <AvatarFallback>
                          {initialData?.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <label
                        htmlFor="input-profile-upload"
                        className="base-semibold cursor-pointer text-[#0095f6]">
                        Change profile photo
                      </label>
                      <input
                        type="file"
                        id="input-profile-upload"
                        onChange={(event) => {
                          if (event.target.files?.[0]) {
                            field.onChange(event.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
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
                <FormLabel className="medium-base">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shadcn-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shadcn-input" {...field} />
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
                  <Input type="text" className="shadcn-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">Bio</FormLabel>
                <FormControl>
                  <Textarea className="shadcn-textarea" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">Phone</FormLabel>
                <FormControl>
                  <Input type="text" className="shadcn-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            type="submit"
            isLoading={form.formState.isSubmitting}>
            Update Profile
          </SubmitButton>
        </form>
      </Form>
    </fieldset>
  );
};

export default EditProfileForm;
