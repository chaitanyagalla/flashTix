import { env } from "./env";
import { app } from "./app";

app.listen(env.PORT, () => {
  console.log(`its running on ${env.PORT}`);
});
