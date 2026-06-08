import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminLogin, useGetAdminMe, getGetAdminMeQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const loginSchema = z.object({
  password: z.string().min(1, "Password required"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  useEffect(() => {
    document.title = "Admin | OUTLAWZ LABS™";
  }, []);

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session, isLoading: checkingSession } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey(), retry: false },
  });

  useEffect(() => {
    if (session?.authenticated) setLocation("/admin/dashboard");
  }, [session, setLocation]);

  const adminLogin = useAdminLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    adminLogin.mutate({ data }, {
      onSuccess: (res) => {
        if (res.success) {
          queryClient.invalidateQueries({ queryKey: getGetAdminMeQueryKey() });
          setLocation("/admin/dashboard");
        }
      },
      onError: () => {
        toast({ title: "ACCESS DENIED", description: "Invalid password.", variant: "destructive" });
      },
    });
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="text-[#FFE600] font-mono uppercase">Authenticating...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6" style={{ fontFamily: "'Space Mono', monospace" }}>
      <div className="w-full max-w-sm">
        <div className="border-[3px] border-[#FFE600] bg-black shadow-[8px_8px_0_#FFE600] p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              OUTLAWZ LABS™
            </h1>
            <div className="mt-2 text-[#FFE600] text-xs font-mono uppercase tracking-widest">ADMIN ACCESS</div>
          </div>

          <div className="border-[3px] border-gray-800 p-2 mb-6 font-mono text-xs text-gray-500 bg-[#111]">
            <span className="text-[#00FF41]">$</span> authenticate --admin
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                PASSWORD
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter admin password"
                data-testid="input-admin-password"
                className="w-full border-[3px] border-gray-600 bg-[#111] text-white px-4 py-3 font-mono text-sm focus:outline-none focus:border-[#FFE600] transition-colors"
              />
              {errors.password && (
                <p className="text-[#FF2D20] text-xs font-mono mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={adminLogin.isPending}
              data-testid="button-admin-login"
              className="w-full border-[3px] border-[#FFE600] bg-[#FFE600] text-black py-4 font-bold uppercase text-sm tracking-widest hover:bg-transparent hover:text-[#FFE600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adminLogin.isPending ? "VERIFYING..." : "ACCESS SYSTEM"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-700 text-xs font-mono">
            DEFAULT: outlawz2025
          </p>
        </div>
      </div>
    </div>
  );
}
