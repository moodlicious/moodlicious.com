import { Link, NotFoundPage } from "nextra-theme-docs";

const NotFound = () => {
    return (
        <NotFoundPage content={null}>
            <h1 className="mb-3 text-2xl font-bold">404 Page Not Found</h1>
            <Link href="/">Return Home</Link>
        </NotFoundPage>
    );
};

export default NotFound;
