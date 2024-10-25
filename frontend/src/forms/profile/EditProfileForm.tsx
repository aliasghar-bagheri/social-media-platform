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
import { EditProfileFormValidation, EditProfileType } from "@/lib/validation";

import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useCallback } from "react";

type EditProfileFormProps = {
  initialData?: EditProfileType;
  handleEditProfile: (data: EditProfileType) => void;
};

const EditProfileForm = ({
  initialData,
  handleEditProfile,
}: EditProfileFormProps) => {
  const form = useForm<z.infer<typeof EditProfileFormValidation>>({
    resolver: zodResolver(EditProfileFormValidation),
    defaultValues: {
      profile: initialData?.profile || "",
      name: initialData?.name || "",
      username: initialData?.username || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      bio: initialData?.bio || "",
    },
  });

  const handleProfileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file: FileList | null = event.target.files;
      if (file?.length) {
        const validationFile: boolean = file[0].type.startsWith("image/");
        if (validationFile) {
          const createUrl = URL.createObjectURL(file[0]);
          form.setValue("profile", createUrl);
          form.clearErrors("profile");
        } else {
          form.setError("profile", {
            message: "Profile format can be: svg, jpg, jpeg, png",
          });
        }
      } else {
        form.setValue("profile", "");
      }
    },
    [form],
  );

  const onSubmit = (values: z.infer<typeof EditProfileFormValidation>) => {
    handleEditProfile(values);
    console.log(values);
  };

  return (
    <>
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
                      <img
                        src={field.value}
                        className="h-full w-full object-cover"
                        alt="profile"
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor="input-profile-upload"
                        className="base-semibold cursor-pointer text-[#0095f6]">
                        Change profile photo
                      </label>
                      <input
                        type="file"
                        id="input-profile-upload"
                        accept="image/*"
                        onChange={handleProfileChange}
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

          <Button type="submit">Update Profile</Button>
        </form>
      </Form>
    </>
  );
};

export default EditProfileForm;
