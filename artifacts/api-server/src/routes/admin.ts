import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "outlawz2025";
const SESSION_KEY = "admin_authenticated";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const session = req.session as Record<string, unknown>;
  session[SESSION_KEY] = true;
  res.json({ success: true, message: "Logged in" });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const session = req.session as Record<string, unknown>;
  const authenticated = session[SESSION_KEY] === true;
  if (!authenticated) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json({ authenticated: true });
});

export default router;
