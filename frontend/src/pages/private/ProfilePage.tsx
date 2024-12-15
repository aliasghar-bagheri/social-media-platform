import AccountStatistics from "@/components/profile/AccountStatistics";
import SavedPostsList from "@/components/saved/SavedPostsList";
import Heading from "@/components/shared/Heading";
import SelectFilter from "@/components/shared/SelectFilter";
import { Button } from "@/components/ui/button";
import { MAIN_ROUTES } from "@/routes";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import Profile from "@/components/profile/Profile";
import { useAuth } from "@/context/AuthProvider";

const ProfilePage = () => {
  const [postsFilter, setPostsFilter] = useState("all");

  const { user } = useAuth();

  const { id } = useParams();

  const isOwner = user?.id === id;

  return (
    <>
      <Helmet>
        <title>Profile user</title>
      </Helmet>
      <section className="container-section">
        <div className="mx-auto flex w-full flex-col gap-14 xl:w-10/12">
          <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="min-w-36">
              <Profile
                userId={user ? user.id : ""}
                profileImage={user?.profile}
                imageStyles="w-36 h-36"
              />
            </div>

            <div className="flex w-full flex-col items-center gap-10 overflow-hidden md:items-start">
              <div className="flex w-full flex-col-reverse items-center gap-10 md:flex-row md:items-start">
                <div className="flex flex-col items-center md:items-start">
                  <Heading variant="h1-semibold" customStyles="max-w-96 text-wrap">
                    {user?.name}
                  </Heading>
                  <p className="body-medium text-light-3">@{user?.username}</p>
                </div>

                <div className="mt-2">
                  {isOwner ? (
                    <Link to={`${MAIN_ROUTES.EDIT_PROFILE}/${user?.id}`}>
                      <Button className="shadcn-btn_ghost flex items-center gap-2">
                        <img
                          src="/assets/icons/edit.svg"
                          width={16}
                          height={16}
                          className="invert-yellow"
                          alt="edit"
                        />
                        <span>Edit Profile</span>
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button>Follow</Button>
                      <Button variant="destructive">Unfollow</Button>
                      <Button className="shadcn-btn_white">Message</Button>
                    </div>
                  )}
                </div>
              </div>

              <AccountStatistics userId={id!} />

              {/* bio */}
              <div className="w-full">
                <p className="base-regular text-center md:text-left">{user?.bio}</p>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-end">
            <SelectFilter
              value={postsFilter}
              onValueChange={setPostsFilter}
              selectItemList={["all", "oldest", "newest"]}
            />
          </div>
          {/* all posts */}
          <div className="w-full">
            <SavedPostsList />
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
