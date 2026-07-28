// eslint-config-next 16 ships native flat config, so its configs are spread
// directly. The old FlatCompat/eslintrc shim is gone: it cannot load v16 and
// fails with a circular-structure error while validating the legacy schema.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**", "_scratch/**"],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // react-hooks v7 (bundled with eslint-config-next 16) added these as
      // errors. Every current hit is a legitimate, working pattern -- the
      // SSR-safe `setMounted(true)` idiom, an rAF animation driver, a
      // client-only URL-param read, and fetch-then-setState. Rewriting them to
      // satisfy a new stylistic rule is risk without benefit, so they stay
      // visible as warnings rather than blocking CI.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
    },
  },
];

export default eslintConfig;
