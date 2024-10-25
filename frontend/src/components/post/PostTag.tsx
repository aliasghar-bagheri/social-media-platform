type PostTagProps = {
  postId: string;
};

const PostTag = ({ postId }: PostTagProps) => {
  return <span className="mx-3 text-light-4">#nature #wildlife</span>;
};

export default PostTag;
