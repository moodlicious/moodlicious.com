import { Link } from "nextra-theme-docs";
import { fetchPlugins, pluginDisplayName, pluginDocsHref } from "@/src/lib/plugins";

const Page = async () => {
    const plugins = await fetchPlugins();

    return (
        <div className="max-w-(--nextra-content-width) mx-auto pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
            <header className="py-20 max-w-prose text-balance">
                <h1 className="text-5xl font-bold mb-4 tracking-tight">
                    Delicious Plugins
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                    Moodle plugins nobody asked for, because one more won&apos;t hurt... right?
                </p>
                <Link
                    href="/docs/plugins"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:opacity-90 transition-opacity no-underline!"
                >
                    Explore all plugins
                    <span>→</span>
                </Link>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 pb-20">
                {plugins.map((plugin) => {
                    const component = plugin.custom_properties["moodle-plugin"]!;
                    return (
                        <Link
                            key={plugin.id}
                            href={pluginDocsHref(component)}
                            className="block p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors no-underline!"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-base m-0">
                                    {pluginDisplayName(component)}
                                </h3>
                                {component.startsWith("local_devkit") && (
                                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                                        dev only
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 m-0">
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
