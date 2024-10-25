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
import { PostFormType, PostFormValidation } from "@/lib/validation";

import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/shared/FileUploader";
import Heading from "@/components/shared/Heading";
import { useNavigate } from "react-router-dom";

type PostFormProps = {
  initialData?: PostFormType;
  handlePostForm: (data: PostFormType) => void;
  type: "Update" | "Create";
};

const PostForm = ({ initialData, handlePostForm, type }: PostFormProps) => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostFormValidation>>({
    resolver: zodResolver(PostFormValidation),
    defaultValues: {
      caption: initialData?.caption || "",
      image_url: initialData?.image_url || "",
      location: initialData?.location || "",
      tags: initialData?.tags || "",
    },
  });

  const onSubmit = (values: z.infer<typeof PostFormValidation>) => {
    handlePostForm(values);

    console.log(values);
  };

  return (
    <>
      <Heading icon={<img src="/assets/icons/add-post.svg" alt={`${type} post`} />}>
        {type} a Post
      </Heading>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 flex w-full flex-col items-center gap-9">
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">Caption</FormLabel>
                <FormControl>
                  <Textarea className="shadcn-textarea" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader
                    image_url={initialData?.image_url}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">Location</FormLabel>
                <FormControl>
                  <Input type="text" className="shadcn-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="medium-base">Tags</FormLabel>
                <FormControl>
                  <Input type="text" className="shadcn-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-center justify-end gap-5">
            <Button onClick={() => navigate(-1)} type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">{type}</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PostForm;
