import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

type SearchProps = {
  query: string;
  onChangeQuery: (query: string) => void;
};

const Search = ({ query, onChangeQuery }: SearchProps) => {
  return (
    <div className="flex w-full items-center rounded-2xl bg-dark-3 px-4 py-3">
      <img src="/assets/icons/search.svg" alt="search" />
      <Input
        type="search"
        value={query}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChangeQuery(event.target.value)
        }
        className="shadcn-input_search"
        placeholder="Search Creators"
      />
    </div>
  );
};

export default Search;
