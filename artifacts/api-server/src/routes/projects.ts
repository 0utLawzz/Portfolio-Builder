import { Router, type IRouter } from "express";
import { eq, ilike, and, sql } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import {
  ListProjectsQueryParams,
  CreateProjectBody,
  GetProjectParams,
  GetProjectResponse,
  GetProjectBySlugParams,
  GetProjectBySlugResponse,
  UpdateProjectParams,
  UpdateProjectBody,
  UpdateProjectResponse,
  DeleteProjectParams,
  ListProjectsResponse,
  GetFeaturedProjectsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects", async (req, res): Promise<void> => {
  const parsed = ListProjectsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search, featured } = parsed.data;

  const conditions = [];
  if (category) conditions.push(eq(projectsTable.category, category));
  if (search) conditions.push(ilike(projectsTable.title, `%${search}%`));
  if (featured === "true") conditions.push(eq(projectsTable.featured, true));

  const projects = await db
    .select()
    .from(projectsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(projectsTable.created_at);

  res.json(ListProjectsResponse.parse(projects.map(p => ({
    ...p,
    created_at: p.created_at.toISOString(),
    tech_stack: p.tech_stack ?? [],
    gallery: p.gallery ?? [],
  }))));
});

router.get("/projects/featured", async (_req, res): Promise<void> => {
  const projects = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.featured, true))
    .orderBy(projectsTable.created_at);

  res.json(GetFeaturedProjectsResponse.parse(projects.map(p => ({
    ...p,
    created_at: p.created_at.toISOString(),
    tech_stack: p.tech_stack ?? [],
    gallery: p.gallery ?? [],
  }))));
});

router.get("/projects/by-slug/:slug", async (req, res): Promise<void> => {
  const params = GetProjectBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.slug, params.data.slug));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(GetProjectBySlugResponse.parse({
    ...project,
    created_at: project.created_at.toISOString(),
    tech_stack: project.tech_stack ?? [],
    gallery: project.gallery ?? [],
  }));
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProjectParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(GetProjectResponse.parse({
    ...project,
    created_at: project.created_at.toISOString(),
    tech_stack: project.tech_stack ?? [],
    gallery: project.gallery ?? [],
  }));
});

router.post("/projects", async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db
    .insert(projectsTable)
    .values({
      ...parsed.data,
      tech_stack: parsed.data.tech_stack ?? [],
      gallery: parsed.data.gallery ?? [],
    })
    .returning();

  res.status(201).json(GetProjectResponse.parse({
    ...project,
    created_at: project.created_at.toISOString(),
    tech_stack: project.tech_stack ?? [],
    gallery: project.gallery ?? [],
  }));
});

router.patch("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateProjectParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db
    .update(projectsTable)
    .set(parsed.data)
    .where(eq(projectsTable.id, params.data.id))
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(UpdateProjectResponse.parse({
    ...project,
    created_at: project.created_at.toISOString(),
    tech_stack: project.tech_stack ?? [],
    gallery: project.gallery ?? [],
  }));
});

router.delete("/projects/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteProjectParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, params.data.id))
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
