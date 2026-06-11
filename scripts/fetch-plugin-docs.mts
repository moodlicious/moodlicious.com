#!/usr/bin/env bun

import dedent from "dedent";
import {
    mkdir,
    readdir,
    readFile,
    rename,
    rm,
    stat,
    writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { simpleGit } from "simple-git";
import { z } from "zod";

const repoSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullish(),
    full_name: z.string(),
    clone_url: z.string(),
    custom_properties: z.object({
        "moodle-plugin": z.string().nullish(),
    }),
});
const reposSchema = z.array(repoSchema);

const API_URL = new URL(
    "https://api.github.com/orgs/moodlicious/repos?type=public&sort=full_name&per_page=100",
);
API_URL.searchParams.set("type", "public");
API_URL.searchParams.set("sort", "full_name");
API_URL.searchParams.set("per_page", "100");

const plugins = await fetch(API_URL, {
    headers: {
        accept: "application/vnd.github+json",
    },
})
    .then((res) => {
        if (!res.ok) {
            throw new Error("Fetch not ok.");
        }
        return res.json();
    })
    .then((plugins) => reposSchema.parseAsync(plugins))
    .then((plugins) =>
        plugins.filter((p) => p.custom_properties["moodle-plugin"]),
    );

const PLUGINS_DIR = ".moodlicious/plugins";
const DOCS_DIR = "src/content/plugins";

await rm(PLUGINS_DIR, { force: true, recursive: true });

await readdir(DOCS_DIR).then(async (items) => {
    for (const item of items) {
        const path = join(DOCS_DIR, item);
        const stats = await stat(path);
        if (!stats.isDirectory()) {
            continue;
        }

        await rm(path, { force: true, recursive: true });
    }
});

await mkdir(PLUGINS_DIR, { recursive: true });

for (const plugin of plugins) {
    const component = plugin.custom_properties["moodle-plugin"];
    if (!component) {
        throw new Error(`${plugin.full_name} missing 'moodle-plugin' property`);
    }

    const clonePath = join(PLUGINS_DIR, plugin.name);

    await simpleGit().clone(plugin.clone_url, clonePath, [
        "--filter=blob:none",
        "--sparse",
    ]);
    await simpleGit(clonePath).raw(["sparse-checkout", "set", "docs"]);

    const pluginDocsDir = join(clonePath, "docs");
    const targetDocsDir = join(DOCS_DIR, component);

    const exists = await stat(pluginDocsDir)
        .then((s) => s.isDirectory())
        .catch(() => false);
    if (!exists) {
        // If the plugin has no documentation yet, then just create a simple markdown file.
        await mkdir(targetDocsDir, { recursive: true });
        const markdown = dedent`
            # ${component}

            ${plugin.description ?? ""}

            Documentation not available.
        `;

        await writeFile(join(targetDocsDir, "index.md"), markdown, "utf8");

        continue;
    }

    await rename(pluginDocsDir, join(DOCS_DIR, component));
}

// Add frontmatter.
for (const plugin of plugins) {
    const frontmatter = dedent`
        ---
        asIndexPage: true
        ---
    `;
    const targetDocsDir = join(
        DOCS_DIR,
        plugin.custom_properties["moodle-plugin"]!,
    );
    const indexPage = join(targetDocsDir, "index.md");

    const exists = await stat(indexPage)
        .then((s) => s.isFile())
        .catch(() => false);
    if (!exists) {
        continue;
    }

    const currentContent = await readFile(indexPage, "utf-8");
    if (currentContent.startsWith("---")) {
        console.info(`${indexPage} already has frontmatter, skipping.`);
        continue;
    }

    const content = [frontmatter, currentContent].join("\n\n");

    await writeFile(indexPage, content, "utf8");
    console.info(`${indexPage} frontmatter successfully injected.`);
}
