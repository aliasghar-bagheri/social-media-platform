import { useState } from "react";
import SelectFilter from "@/components/shared/SelectFilter";
import ExploreDataList from "./ExploreDataList";
import Search from "@/components/shared/Search";
import TagList from "@/components/shared/TagList";
import Heading from "@/components/shared/Heading";

const ExploreContainer = () => {
  const [exploreFilter, setExploreFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <div className="flex w-full flex-col items-center gap-20">
      <div className="w-full space-y-5 text-center sm:w-[600px]">
        <Heading customStyles="mx-auto">Search Hashtags</Heading>
        <Search query={searchTerm} onChangeQuery={setSearchTerm} />
        <TagList />
      </div>

      <div className="w-full space-y-8">
        <div className="flex items-center justify-between">
          <Heading variant="h2-bold">Popular Today</Heading>
          <SelectFilter
            value={exploreFilter}
            onValueChange={setExploreFilter}
            selectItemList={["all", "latest"]}
          />
        </div>
        <ExploreDataList />
      </div>
    </div>
  );
};

export default ExploreContainer;
