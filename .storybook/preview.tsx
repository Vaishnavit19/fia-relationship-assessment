import type { Preview } from "@storybook/nextjs";
import "../src/styles/globals.scss";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#faf9ff",
        },
        {
          name: "dark",
          value: "#2d3748",
        },
        {
          name: "gradient",
          value:
            "linear-gradient(135deg, #e8e5ff 0%, #f4f2ff 50%, #faf9ff 100%)",
        },
      ],
    },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ fontFamily: "Inter, sans-serif" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
