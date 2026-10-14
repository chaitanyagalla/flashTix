import z from "zod";

const cursorSchema = z.object({
  starts_at: z.iso.datetime(),
  id: z.uuid(),
});

export type EventCursor = z.infer<typeof cursorSchema>;

export function encodeCursor(cursor: EventCursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

export function decodeCursor(value: string):EventCursor | null {
    try {
        if (value.length > 512 || !/^[A-Za-z0-9_-]+$/.test(value) ) {
            return null;
        }
        const json = Buffer.from(
            value,
            "base64url"
        ).toString("utf-8")
        
        const parsed = cursorSchema.safeParse(JSON.parse(json));
        return parsed.success ? parsed.data: null ;
    } catch (error) {
        return null
    }
}