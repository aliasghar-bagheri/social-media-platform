import Heading from "@/components/shared/Heading"
import { Button } from "@/components/ui/button"
import { MAIN_ROUTES } from "@/routes"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center gap-5 p-5 text-center">
        <Heading variant="h1-bold" customStyles="mx-auto">Oops!</Heading>
        <p className="base-semibold">we couldn't find the page you were looking for</p>
        <Link to={MAIN_ROUTES.HOME}>
          <Button>Go Back</Button>
        </Link>
    </section>
  )
}

export default NotFoundPage