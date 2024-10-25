import Heading from "@/components/shared/Heading";
import PeopleCard from "./PeopleCard";
import { T_People } from "@/types";

const TopCreators = () => {
  const initialData: T_People[] = [
    {
      id: "1",
      user_id: "1",
      name: "John",
      isFollowed: true,
    },
    {
      id: "2",
      user_id: "3",
      name: "Jack",
      isFollowed: false,
    },
    {
      id: "3",
      user_id: "20",
      name: "peter",
      isFollowed: false,
    },
    {
      id: "4",
      user_id: "10",
      name: "David",
      isFollowed: true,
    },
  ];

  return (
    <div className="scrollbar sticky right-2 top-2 hidden max-h-screen w-[480px] flex-col items-center gap-10 overflow-y-auto px-4 xl:flex">
      <Heading variant="h3-bold">Top Creators</Heading>
      <div className="grid w-full gap-5 xl:grid-cols-2">
        {initialData.map((people: T_People) => (
          <PeopleCard key={people.id} peopleData={people} />
        ))}
      </div>
    </div>
  );
};

export default TopCreators;
