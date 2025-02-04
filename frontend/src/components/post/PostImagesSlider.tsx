import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type PostImagesSliderProps = {
  postId: string;
};

const PostImagesSlider = ({ postId }: PostImagesSliderProps) => {
  const imageList: string[] = [
    "/assets/images/example.jpg",
    "/assets/images/example.jpg",
    "/assets/images/example.jpg",
    "/assets/images/example.jpg",
    "/assets/images/example.jpg",
  ];

  console.log(postId);

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="relative mt-5 max-h-[540px] w-full overflow-hidden rounded-[30px]">
      <CarouselContent>
        {imageList.map((image, index) => (
          <CarouselItem key={index}>
            <img
              src={image}
              alt="image"
              width={"auto"}
              className="h-full w-full rounded-[30px] object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {imageList.length > 1 && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
};

export default PostImagesSlider;
