import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { AccountService } from "./account-service";
import { AccountRepository } from "./account-respository";

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly accountService: AccountService,
    private readonly accountRepository: AccountRepository
  ) {}

  async onApplicationBootstrap() {
    await this.seedUser();
  }

  private async seedUser() {
    const email = "aivacol@aivacol.com";
    const username = "aivacol";
    const password = "AivacolStrong!Password123";

    const existingUser = await this.accountRepository.findByEmail(email);
    if (!existingUser) {
      console.log(`Seeding default user: ${username}`);
      await this.accountService.create({
        email,
        username,
        password,
      });
      console.log("Default user seeded successfully.");
    }
  }
}
