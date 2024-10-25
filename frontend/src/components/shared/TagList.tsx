import { demoTags } from "@/constants";

const TagList = () => {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-7">
      {demoTags.map((tag: string, index: number) => (
        <span key={index} className="badge">
          # {tag}
        </span>
      ))}
    </div>
  );
};

export default TagList;
