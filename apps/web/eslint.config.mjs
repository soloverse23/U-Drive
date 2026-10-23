import nextPlugin from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import rootConfig from "../../eslint.config.mjs";

export default [
  ...rootConfig,
  {
    plugins: { "@next/next": nextPlugin, react },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // Spec §0.6: every user-facing string comes from translation files.
      "react/jsx-no-literals": ["error", { noStrings: false, ignoreProps: true }],
    },
  },
];
