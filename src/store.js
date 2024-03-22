import { init } from "@rematch/core";
import createLoadingPlugin from "@rematch/loading"
import * as models from "./model";

export const store = init({
  models,
  plugins: [createLoadingPlugin]
})

export default store;