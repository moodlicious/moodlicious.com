import { Link } from "nextra-theme-docs";

const Page = () => {
    return (
        <div className="max-w-(--nextra-content-width) mx-auto pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
            <header className="my-16 max-w-prose text-balance">
                <h1 className="text-4xl font-semibold mb-3">
                    Delicious Plugins
                </h1>
                <p className="text-xl mb-6">
                    Moodle plugins nobody asked for, because one more won
                    {"'"}t hurt... right?
                </p>

                <Link href="/docs/plugins">Explore Plugins</Link>
            </header>
        </div>
    );
};

export default Page;
