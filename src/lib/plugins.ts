import { z } from "zod";

export const repoSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullish(),
    full_name: z.string(),
    clone_url: z.string(),
    custom_properties: z.object({
        "moodle-plugin": z.string().nullish(),
    }),
});

export const reposSchema = z.array(repoSchema);

export type PluginRepo = z.infer<typeof repoSchema>;

const API_URL =
    "https://api.github.com/orgs/moodlicious/repos?type=public&sort=full_name&per_page=100";

export async function fetchPlugins(): Promise<PluginRepo[]> {
    const res = await fetch(API_URL, {
        headers: {
            accept: "application/vnd.github+json",
        },
    });

    if (!res.ok) {
        throw new Error(`GitHub API returned ${res.status}`);
    }

    const data = await res.json();
    const repos = reposSchema.parse(data);
    return repos.filter((p) => p.custom_properties["moodle-plugin"]);
}

export function pluginDisplayName(component: string): string {
    if (component.startsWith("dataformat_")) {
        return component;
    }
    return component
        .replace(/^local_/, "")
        .split(/[_-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
}

export function pluginDocsHref(component: string): string {
    return `/docs/plugins/${component}`;
}
