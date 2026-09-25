import { app } from "./app.js";

const PORT = Number(process.env.PORT ?? 4001);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}` )
})