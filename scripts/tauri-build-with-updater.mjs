import { spawnSync } from "node:child_process";

const mode = process.argv[2];
const extraArgs = process.argv.slice(3);

if (!mode || !["staging", "prod"].includes(mode)) {
  console.error("Usage: node scripts/tauri-build-with-updater.mjs <staging|prod> [...tauri build args]");
  process.exit(1);
}

const suffix = mode === "staging" ? "STAGING" : "PROD";
const endpointEnv = `TAURI_UPDATER_${suffix}_ENDPOINT`;
const pubkeyEnv = `TAURI_UPDATER_${suffix}_PUBKEY`;

const endpoint = process.env[endpointEnv];
const pubkey = process.env[pubkeyEnv];

if (!endpoint) {
  console.error(`Missing ${endpointEnv} environment variable.`);
  process.exit(1);
}

if (!pubkey) {
  console.error(`Missing ${pubkeyEnv} environment variable.`);
  process.exit(1);
}

const tauriConfigPatch = {
  bundle: {
    createUpdaterArtifacts: true,
  },
  plugins: {
    updater: {
      endpoints: [endpoint],
      pubkey,
    },
  },
};

const env = {
  ...process.env,
  TAURI_CONFIG: JSON.stringify(tauriConfigPatch),
};

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(
  npmCmd,
  ["run", "tauri", "--", "build", ...extraArgs],
  {
    stdio: "inherit",
    env,
  }
);

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
