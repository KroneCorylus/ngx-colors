import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";

export default defineConfig(
  {
    ignores: [
      "**/node_modules/**",
      "dist/**",
      "coverage/**",
    ],
  },
  {
    files: ["projects/**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Keep the change detection and injection behavior preserved by Angular's migrations.
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
      "@angular-eslint/prefer-inject": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["projects/ngx-colors/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "ngxColors", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "ngx-colors", style: "kebab-case" },
      ],
    },
  },
  {
    files: ["projects/ngx-colors-examples/**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],
    },
  },
  {
    files: ["projects/**/*.spec.ts"],
    rules: { "@angular-eslint/prefer-standalone": "off" },
  },
  {
    files: [
      "projects/ngx-colors/src/lib/components/ngx-colors/ngx-colors.component.ts",
    ],
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "ngx", style: "kebab-case" },
      ],
    },
  },
  {
    files: ["projects/**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
  },
);
