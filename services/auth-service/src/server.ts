import { app } from "./app.js";
import { env } from "./schemas/env.schema.js";

const PORT = Number(env.PORT ?? 4001);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}` )
})