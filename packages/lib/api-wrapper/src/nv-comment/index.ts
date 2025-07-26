import type {FetchFunc} from "../types";
import {V1} from "./v1";

export class NvComment {
  v1: V1;

  constructor(baseURL: string, customFetch?: FetchFunc) {
    const endpoint = new URL(baseURL);

    this.v1 = new V1(endpoint, customFetch ?? ((...args) => fetch(...args)));
  }
}
