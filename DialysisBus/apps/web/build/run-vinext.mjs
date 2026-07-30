import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const vinextCli = fileURLToPath(
  new URL("../node_modules/vinext/dist/cli.js", import.meta.url),
);

const result = spawnSync(process.execPath, [vinextCli, ...process.argv.slice(2)], {
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: ".wrangler/wrangler.log",
  },
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
