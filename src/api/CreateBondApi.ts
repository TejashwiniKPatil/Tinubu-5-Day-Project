import { APIRequestContext } from "@playwright/test";
import { payload2 } from "../../test-data/constants";

export class CreateBondApi {
  constructor(private readonly req: APIRequestContext) {}   
  createBond(accessToken: string) {
    return this.req.post(new URL("/bond/bonds/actions/execute", process.env.LOGIN_API ?? "").toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: payload2,
    });
  }
}
