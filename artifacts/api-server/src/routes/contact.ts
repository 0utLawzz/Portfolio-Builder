import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, contactMessagesTable } from "@workspace/db";
import {
  SubmitContactBody,
  DeleteContactMessageParams,
  ListContactMessagesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/contact", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(contactMessagesTable.created_at);

  res.json(ListContactMessagesResponse.parse(messages.map(m => ({
    ...m,
    created_at: m.created_at.toISOString(),
  }))));
});

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [message] = await db
    .insert(contactMessagesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json({
    ...message,
    created_at: message.created_at.toISOString(),
  });
});

router.delete("/contact/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteContactMessageParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [message] = await db
    .delete(contactMessagesTable)
    .where(eq(contactMessagesTable.id, params.data.id))
    .returning();

  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
