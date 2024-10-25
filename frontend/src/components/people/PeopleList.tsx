import { T_People } from "@/types";
import PeopleCard from "./PeopleCard";

const PeopleList = () => {
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
    <div className="grid-section">
      {initialData.map((people: T_People) => (
        <PeopleCard key={people.id} peopleData={people} />
      ))}
    </div>
  );
};

export default PeopleList;
