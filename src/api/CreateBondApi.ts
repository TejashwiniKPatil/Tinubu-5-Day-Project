import { APIRequestContext } from "@playwright/test";
import { payload3 } from "../../test-data/constants";
import { getApiBaseUrl } from "../utils/environment";

export class CreateBondApi {
  constructor(private readonly req: APIRequestContext) {}   
  createBond(accessToken: string) {
    return this.req.post(new URL("/bond/bonds/actions/execute", getApiBaseUrl()).toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: payload3,
    });
  }
}
