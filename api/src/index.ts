import * as fcl from "@onflow/fcl"
import { hideBin } from "yargs/helpers"
import yargs from "yargs/yargs"
import initApp from "./app"
import { getConfig } from "./config"
import initDB from "./db"
import { BlockCursorService } from "./services/block-cursor"
import { FlowService } from "./services/flow"
import { KittyItemsService } from "./services/kitty-items"
import { StorefrontService } from "./services/storefront"
import { ListingHandler } from "./workers/listing-handler"

const argv = yargs(hideBin(process.argv)).argv;
const DEV = argv.dev;

let envVars;

if (DEV) {
  const env = require("dotenv");
  const expandEnv = require("dotenv-expand");

  const config = env.config({
    path: ".env.local"
  });

  expandEnv(config);
  envVars = config.parsed;
}

async function run() {
  const config = getConfig(envVars);
  const db = initDB(config);

  // Make sure to disconnect from DB when exiting the process
  process.on("SIGTERM", () => {
    db.destroy().then(() => {
      process.exit(0);
    });
  });

  // Run all database migrations
  await db.migrate.latest();

  const flowService = new FlowService(
    config.minterAddress,
    config.minterPrivateKeyHex,
    config.minterAccountKeyIndex
  );

  const storefrontService = new StorefrontService(
    flowService,
    config.fungibleTokenAddress,
    config.flowTokenAddress,
    config.nonFungibleTokenAddress,
    config.storefrontAddress,
    config.minterAddress,
  );

  // Make sure we're pointing to the correct Flow Access API.
  fcl
    .config()
    .put("accessNode.api", config.accessApi)
    .put("decoder.Type", val => val.staticType);

  const startWorker = () => {
    console.log("Starting Flow event worker ....");
    const blockCursorService = new BlockCursorService();

    const listingWorker = new ListingHandler(
      storefrontService,
      blockCursorService,
      flowService
    );

    listingWorker.run();
  };

  const startAPIServer = () => {
    console.log("Starting API server ....");

    const kittyItemsService = new KittyItemsService(
      flowService,
      config.nonFungibleTokenAddress,
      config.minterAddress,
      config.fungibleTokenAddress,
      config.flowTokenAddress,
      config.storefrontAddress
    );

    const app = initApp(
      kittyItemsService,
      storefrontService
    );

    app.listen(config.port, () => {
      console.log(`Listening on port ${config.port}!`);
    });
  };

  if (DEV) {
    // If we're in dev, run everything in one process.
    startWorker();
    startAPIServer();
  } else if (argv.worker) {
    // If we're not in dev, look for flags. We do this so that
    // the worker can be started in seperate process using flag.
    // eg:
    // $> node /api/dist/index.js (starts API server)
    // $> node /api/dist/index.js --worker (starts worker)

    // Start the worker only if worker is passed as command flag.
    // See above notes for why.
    startWorker();
  } else {
    // Default when not in dev: start the API server.
    startAPIServer();
  }
}

const redOutput = "\x1b[31m%s\x1b[0m";

run().catch((e) => {
  console.error(redOutput, e);
  process.exit(1);
});
