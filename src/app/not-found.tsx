import { Link, NotFoundPage } from "nextra-theme-docs";

const NotFound = () => {
    return (
        <NotFoundPage content={null}>
            <h1 className="text-2xl font-bold mb-3">404 Page Not Found</h1>
            <Link href="/">Return Home</Link>
        </NotFoundPage>
    );
};

export default NotFound;
