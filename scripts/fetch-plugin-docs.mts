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
import { fetchPlugins, type PluginRepo } from "../src/lib/plugins.js";

const plugins: PluginRepo[] = await fetchPlugins();

console.info(`Found ${plugins.length} plugins.`);

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

console.log("Cloning plugin docs");

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

    console.info(`Cloned ${plugin.name}`);

    const pluginDocsDir = join(clonePath, "docs");
    const targetDocsDir = join(DOCS_DIR, component);

    const exists = await stat(pluginDocsDir)
        .then((s) => s.isDirectory())
        .catch(() => false);
    if (!exists) {
        console.warn(
            `${plugin.name} does not have /docs directory yet, skipping by using not available template.`,
        );

        await mkdir(targetDocsDir, { recursive: true });
        const markdown = dedent`
            # ${component}

            ${plugin.description ?? ""}

            Documentation not available.
        `;

        await writeFile(join(targetDocsDir, "index.md"), markdown, "utf8");

        console.info(
            `${plugin.name} docs not available template successfully installed.`,
        );
        continue;
    }

    await rename(pluginDocsDir, join(DOCS_DIR, component));
    console.info(`${plugin.name} docs successfully installed.`);
}

console.log("Injecting frontmatter metadata");

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
