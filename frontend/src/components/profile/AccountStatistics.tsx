type AccountStatisticsProps = {
  userId: string;
};

const AccountStatistics = ({ userId }: AccountStatisticsProps) => {
  return (
    <div className="flex w-full flex-col justify-center gap-10 sm:flex-row sm:items-center md:justify-start">
      <div className="body-medium space-y-2 text-center md:text-left">
        <span className="text-primary-500">273</span>
        <p>Posts</p>
      </div>
      <div className="body-medium space-y-2 text-center md:text-left">
        <span className="text-primary-500">18</span>
        <p>Followers</p>
      </div>
      <div className="body-medium space-y-2 text-center md:text-left">
        <span className="text-primary-500">150</span>
        <p>Following</p>
      </div>
    </div>
  );
};

export default AccountStatistics;
