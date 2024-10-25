import { T_People } from "@/types";
import Profile from "@/components/profile/Profile";
import Heading from "@/components/shared/Heading";
import { Button } from "@/components/ui/button";

type PeopleCardProps = {
  peopleData: T_People;
};

const PeopleCard = ({ peopleData }: PeopleCardProps) => {
  return (
    <div className="people-card">
      <Profile userId={peopleData.id} imageStyles="people-card_image" />
      <Heading variant="h3-bold" customStyles="line-clamp-1 mx-auto capitalize">
        {peopleData.name}
      </Heading>
      {peopleData.isFollowed ? (
        <Button size="sm" variant="destructive">
          Unfollow
        </Button>
      ) : (
        <Button size="sm">Follow</Button>
      )}
    </div>
  );
};

export default PeopleCard;
