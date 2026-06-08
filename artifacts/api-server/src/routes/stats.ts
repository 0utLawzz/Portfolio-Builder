import { Router, type IRouter } from "express";
import { eq, count, sql } from "drizzle-orm";
import { db, projectsTable, contactMessagesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [{ total: totalProjects }] = await db
    .select({ total: count() })
    .from(projectsTable);

  const [{ total: featuredProjects }] = await db
    .select({ total: count() })
    .from(projectsTable)
    .where(eq(projectsTable.featured, true));

  const [{ total: totalMessages }] = await db
    .select({ total: count() })
    .from(contactMessagesTable);

  const [{ total: unreadMessages }] = await db
    .select({ total: count() })
    .from(contactMessagesTable)
    .where(eq(contactMessagesTable.read, false));

  const categoryRows = await db
    .select({
      category: projectsTable.category,
      count: count(),
    })
    .from(projectsTable)
    .groupBy(projectsTable.category);

  const projectsByCategory = categoryRows.map(row => ({
    category: row.category ?? "Uncategorized",
    count: row.count,
  }));

  res.json({
    totalProjects,
    featuredProjects,
    totalMessages,
    unreadMessages,
    projectsByCategory,
  });
});

export default router;
