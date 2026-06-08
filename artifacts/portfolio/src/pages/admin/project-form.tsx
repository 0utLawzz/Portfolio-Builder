import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useCreateProject, useUpdateProject, useGetProject,
  useGetAdminMe, getGetAdminMeQueryKey, getListProjectsQueryKey, getGetProjectQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./dashboard";

const projectSchema = z.object({
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required").regex(/^[a-z0-9-]+$/, "Slug: lowercase, numbers, hyphens only"),
  description: z.string().min(1, "Description required"),
  long_description: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  tech_stack: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["active", "archived", "wip"]),
  cover_image: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  gallery: z.string().optional(),
  github_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  live_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  featured: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const categories = ["Automation", "AI", "SaaS", "OCR", "Internal Tools", "Web Apps"];

export default function AdminProjectForm() {
  const { id } = useParams<{ id?: string }>();
  const editId = id ? parseInt(id, 10) : undefined;
  const isEdit = !!editId;

  useEffect(() => {
    document.title = `${isEdit ? "Edit" : "New"} Project | OUTLAWZ LABS™ Admin`;
  }, [isEdit]);

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session, isLoading: checkingSession } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey(), retry: false },
  });

  useEffect(() => {
    if (!checkingSession && !session?.authenticated) setLocation("/admin");
  }, [session, checkingSession, setLocation]);

  const { data: existingProject } = useGetProject(editId!, {
    query: { enabled: isEdit && !!editId, queryKey: getGetProjectQueryKey(editId!) },
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: "active",
      featured: false,
    },
  });

  useEffect(() => {
    if (existingProject) {
      reset({
        title: existingProject.title,
        slug: existingProject.slug,
        description: existingProject.description,
        long_description: existingProject.long_description ?? "",
        problem: existingProject.problem ?? "",
        solution: existingProject.solution ?? "",
        tech_stack: existingProject.tech_stack?.join(", ") ?? "",
        category: existingProject.category ?? "",
        status: existingProject.status as "active" | "archived" | "wip",
        cover_image: existingProject.cover_image ?? "",
        gallery: existingProject.gallery?.join("\n") ?? "",
        github_url: existingProject.github_url ?? "",
        live_url: existingProject.live_url ?? "",
        featured: existingProject.featured,
      });
    }
  }, [existingProject, reset]);

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const onSubmit = (data: ProjectFormData) => {
    const payload = {
      ...data,
      tech_stack: data.tech_stack ? data.tech_stack.split(",").map((t) => t.trim()).filter(Boolean) : [],
      gallery: data.gallery ? data.gallery.split("\n").map((u) => u.trim()).filter(Boolean) : [],
      cover_image: data.cover_image || undefined,
      github_url: data.github_url || undefined,
      live_url: data.live_url || undefined,
      long_description: data.long_description || undefined,
      problem: data.problem || undefined,
      solution: data.solution || undefined,
      category: data.category || undefined,
    };

    if (isEdit && editId) {
      updateProject.mutate({ id: editId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey({}) });
          queryClient.invalidateQueries({ queryKey: getGetProjectQueryKey(editId) });
          toast({ title: "UPDATED", description: "Project updated successfully." });
          setLocation("/admin/projects");
        },
        onError: () => toast({ title: "ERROR", description: "Failed to update.", variant: "destructive" }),
      });
    } else {
      createProject.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey({}) });
          toast({ title: "CREATED", description: "Project created successfully." });
          setLocation("/admin/projects");
        },
        onError: () => toast({ title: "ERROR", description: "Failed to create.", variant: "destructive" }),
      });
    }
  };

  const isPending = createProject.isPending || updateProject.isPending;
  const featured = watch("featured");

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 mb-2">{label}</label>
      {children}
      {error && <p className="text-[#FF2D20] text-xs font-mono mt-1">{error}</p>}
    </div>
  );

  const inputCls = "w-full border-[3px] border-black px-4 py-3 font-mono text-sm focus:outline-none focus:bg-[#FFFBE6] transition-colors bg-white";

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-black uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {isEdit ? "EDIT PROJECT" : "NEW PROJECT"}
          </h1>
          <div className="w-16 h-[3px] bg-[#FFE600] mt-2" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="border-[3px] border-black bg-white p-6 shadow-[4px_4px_0_#0A0A0A]">
            <h2 className="text-2xl font-bold uppercase mb-6 border-b-[2px] border-black pb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              BASIC INFO
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Title *" error={errors.title?.message}>
                <input {...register("title")} className={inputCls} placeholder="OCR Document Pipeline" data-testid="input-project-title" />
              </Field>
              <Field label="Slug *" error={errors.slug?.message}>
                <input {...register("slug")} className={inputCls} placeholder="ocr-document-pipeline" data-testid="input-project-slug" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description *" error={errors.description?.message}>
                <textarea {...register("description")} rows={3} className={`${inputCls} resize-none`} placeholder="Short description..." data-testid="input-project-description" />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Full Overview" error={errors.long_description?.message}>
                <textarea {...register("long_description")} rows={4} className={`${inputCls} resize-none`} placeholder="Detailed overview..." />
              </Field>
            </div>
          </div>

          <div className="border-[3px] border-black bg-white p-6 shadow-[4px_4px_0_#0A0A0A]">
            <h2 className="text-2xl font-bold uppercase mb-6 border-b-[2px] border-black pb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              PROBLEM / SOLUTION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="The Problem" error={errors.problem?.message}>
                <textarea {...register("problem")} rows={4} className={`${inputCls} resize-none`} placeholder="What problem did this solve?" />
              </Field>
              <Field label="The Solution" error={errors.solution?.message}>
                <textarea {...register("solution")} rows={4} className={`${inputCls} resize-none`} placeholder="How did you solve it?" />
              </Field>
            </div>
          </div>

          <div className="border-[3px] border-black bg-white p-6 shadow-[4px_4px_0_#0A0A0A]">
            <h2 className="text-2xl font-bold uppercase mb-6 border-b-[2px] border-black pb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              CLASSIFICATION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Category">
                <select {...register("category")} className={inputCls} data-testid="select-project-category">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Status *" error={errors.status?.message}>
                <select {...register("status")} className={inputCls} data-testid="select-project-status">
                  <option value="active">Active</option>
                  <option value="wip">WIP</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
              <Field label="Tech Stack (comma-separated)">
                <input {...register("tech_stack")} className={inputCls} placeholder="Python, Node.js, React" />
              </Field>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setValue("featured", !featured)}
                data-testid="button-toggle-featured"
                className={`border-[3px] border-black px-6 py-3 font-bold uppercase text-sm transition-colors ${featured ? "bg-[#FFE600] text-black" : "bg-white text-black hover:bg-gray-100"}`}
              >
                {featured ? "FEATURED: ON" : "FEATURED: OFF"}
              </button>
              <span className="text-xs font-mono text-gray-500">Featured projects appear on the homepage</span>
            </div>
          </div>

          <div className="border-[3px] border-black bg-white p-6 shadow-[4px_4px_0_#0A0A0A]">
            <h2 className="text-2xl font-bold uppercase mb-6 border-b-[2px] border-black pb-3" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              MEDIA & LINKS
            </h2>
            <div className="space-y-4">
              <Field label="Cover Image URL" error={errors.cover_image?.message}>
                <input {...register("cover_image")} className={inputCls} placeholder="https://..." />
              </Field>
              <Field label="Gallery Images (one URL per line)" error={errors.gallery?.message}>
                <textarea {...register("gallery")} rows={4} className={`${inputCls} resize-none`} placeholder={"https://...\nhttps://..."} />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="GitHub URL" error={errors.github_url?.message}>
                  <input {...register("github_url")} className={inputCls} placeholder="https://github.com/..." />
                </Field>
                <Field label="Live URL" error={errors.live_url?.message}>
                  <input {...register("live_url")} className={inputCls} placeholder="https://..." />
                </Field>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              data-testid="button-save-project"
              className="flex-1 border-[3px] border-black bg-[#FFE600] text-black py-4 font-bold uppercase text-sm tracking-widest shadow-[4px_4px_0_#0A0A0A] hover:shadow-[2px_2px_0_#0A0A0A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "SAVING..." : isEdit ? "UPDATE PROJECT" : "CREATE PROJECT"}
            </button>
            <button
              type="button"
              onClick={() => setLocation("/admin/projects")}
              className="border-[3px] border-black bg-white text-black px-8 py-4 font-bold uppercase text-sm hover:bg-gray-100 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
