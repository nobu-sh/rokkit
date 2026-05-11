import antfu, { GLOB_SRC } from "@antfu/eslint-config";

function deepMergeArraysOverwrite(target, source) {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (Array.isArray(source[key]) && Array.isArray(target[key])) {
      output[key] = source[key];
    }
    else if (source[key] && typeof source[key] === "object") {
      output[key] = deepMergeArraysOverwrite(target[key] || {}, source[key]);
    }
    else {
      output[key] = source[key];
    }
  }

  return output;
}

/**
 * Antfu's javascript / typescript / jsx / react / etc. blocks ship with no `files` filter,
 * so their rules try to run on every file ESLint encounters — including .css, which crashes
 * rules that call JS-only APIs like `sourceCode.getAllComments`. Re-scope any unfiltered
 * rule block to JS/TS source files so non-JS languages (e.g. `@eslint/css`) can live alongside.
 */
function scopeRuleBlocksToSource(blocks) {
  return blocks.map((block) => {
    if (!block || typeof block !== "object")
      return block;
    if (block.files || block.ignores)
      return block;
    if (!block.rules || Object.keys(block.rules).length === 0)
      return block;
    return { ...block, files: [GLOB_SRC] };
  });
}

/**
 * @param  {Parameters<typeof import("@antfu/eslint-config").antfu>} args
 */
export default async function antfuExtended(...args) {
  const [config, ...userConfigs] = args;

  /**
   * @type {Parameters<typeof import("@antfu/eslint-config").antfu>[0]}
   */
  const defaults = {
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
    typescript: {
      // This needs to be project level
      // parserOptions: {
      //   projectService: true,
      //   tsconfigRootDir: import.meta.dirname,
      // },
      overrides: {
        "no-useless-return": "off",
      },
    },
    javascript: {
      overrides: {
        "no-useless-return": "off",
      },
    },
    markdown: false,
  };

  const resolved = await antfu(
    deepMergeArraysOverwrite(defaults, config || {}),
    // Disable JSON sorting keys. PNPM likes to reorder them and it is annoying.
    {
      files: ["**/package.json", "**/tsconfig.json", "**/tsconfig.*.json"],
      name: "noctis/sort/disable-package-json",
      rules: {
        "jsonc/sort-array-values": "off",
        "jsonc/sort-keys": "off",
      },
    },
    ...userConfigs,
  );

  return scopeRuleBlocksToSource(resolved);
}
