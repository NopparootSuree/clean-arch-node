import { closeLogger } from "@utils/logger";

afterAll(async () => {
  await closeLogger();
});