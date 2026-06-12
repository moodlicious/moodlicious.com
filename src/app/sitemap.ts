import type { MetadataRoute } from "next";
import { PageMapItem } from "nextra";
import { getPageMap } from "nextra/page-map";

export const dynamic = "force-static";

const baseUrl = new URL("https://moodlicious.com/");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const items = await getPageMap("/docs");

    return [
        {
            url: baseUrl.toString(),
            priority: 1,
        },
        ...items
            .flatMap((item) => pageItemToSitemapItems(item))
            .filter((item) => item !== null),
    ];
}

const pageItemToSitemapItems = (
    item: PageMapItem,
    depth: number = 0,
): MetadataRoute.Sitemap => {
    if ("data" in item) {
        return [];
    }

    if ("children" in item) {
        return item.children.flatMap((page) =>
            pageItemToSitemapItems(page, depth + 1),
        );
    }

    const lastModified = item.frontMatter?.timestamp ?? undefined;

    return [
        {
            url: new URL(item.route + "/", baseUrl).toString(),
            priority: Math.max(0.3, 1 - depth / 10),
            lastModified: lastModified ? new Date(lastModified) : undefined,
        } satisfies MetadataRoute.Sitemap[number],
    ];
};
