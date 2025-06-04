import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: ["@storybook/addon-links"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    // Remove existing CSS rules to avoid conflicts
    config.module!.rules = config.module!.rules!.filter((rule) => {
      if (typeof rule !== "object" || !rule) return true;
      if (rule === "...") return true;

      const test = rule.test;
      if (!test) return true;

      const testStr = test.toString();
      return (
        !testStr.includes("css") &&
        !testStr.includes("scss") &&
        !testStr.includes("sass")
      );
    });

    // Add our SCSS handling
    config.module!.rules!.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              auto: (resourcePath: string) => resourcePath.includes(".module."),
              localIdentName: "[name]__[local]--[hash:base64:5]",
            },
            importLoaders: 1,
          },
        },
        {
          loader: "sass-loader",
          options: {
            sassOptions: {
              includePaths: [path.resolve(__dirname, "../src/styles")],
            },
          },
        },
      ],
      include: path.resolve(__dirname, "../src"),
    });

    // Handle path aliases
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
      };
    }

    return config;
  },
};

export default config;
