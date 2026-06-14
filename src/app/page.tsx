import { Link } from "nextra-theme-docs";
import {
    fetchPlugins,
    pluginDisplayName,
    pluginDocsHref,
} from "@/src/lib/plugins";

const Page = async () => {
    const plugins = await fetchPlugins();

    return (
        <div className="mx-auto max-w-(--nextra-content-width) pr-[max(env(safe-area-inset-right),1.5rem)] pl-[max(env(safe-area-inset-left),1.5rem)]">
            <header className="max-w-prose py-20 text-balance">
                <h1 className="mb-4 text-5xl font-bold tracking-tight">
                    Delicious Plugins
                </h1>
                <p className="mb-8 text-xl leading-relaxed text-gray-500 dark:text-gray-400">
                    Moodle plugins nobody asked for, because one more won&apos;t
                    hurt... right?
                </p>
                <Link
                    href="/docs/plugins"
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white no-underline! transition-opacity hover:opacity-90 dark:bg-white dark:text-gray-900"
                >
                    Explore all plugins
                    <span>→</span>
                </Link>
            </header>

            <div className="grid gap-4 pb-20 sm:grid-cols-2">
                {plugins.map((plugin) => {
                    const component =
                        plugin.custom_properties["moodle-plugin"]!;
                    return (
                        <Link
                            key={plugin.id}
                            href={pluginDocsHref(component)}
                            className="block rounded-xl border border-gray-200 p-5 no-underline! transition-colors hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <h3 className="m-0 text-base font-semibold">
                                    {pluginDisplayName(component)}
                                </h3>
                                {component.startsWith("local_devkit") && (
                                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                        dev only
                                    </span>
                                )}
                            </div>
                            <p className="m-0 text-sm text-gray-500 dark:text-gray-400">
                                {plugin.description ?? ""}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Page;
