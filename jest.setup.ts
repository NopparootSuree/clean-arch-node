import { closeLogger } from "@configs/logger.config";

afterAll(async () => {
  await closeLogger();
});