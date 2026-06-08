import { useEffect } from "react";
import { useLocation } from "wouter";
import { useListContactMessages, useDeleteContactMessage, useGetAdminMe, getGetAdminMeQueryKey, getListContactMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./dashboard";
import { Trash2, Mail } from "lucide-react";

export default function AdminMessages() {
  useEffect(() => {
    document.title = "Messages | OUTLAWZ LABS™ Admin";
  }, []);

  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session, isLoading: checkingSession } = useGetAdminMe({
    query: { queryKey: getGetAdminMeQueryKey(), retry: false },
  });

  useEffect(() => {
    if (!checkingSession && !session?.authenticated) setLocation("/admin");
  }, [session, checkingSession, setLocation]);

  const { data: messages, isLoading } = useListContactMessages({
    query: { queryKey: getListContactMessagesQueryKey() },
  });

  const deleteMessage = useDeleteContactMessage();

  const handleDelete = (id: number) => {
    if (!confirm("Delete this message?")) return;
    deleteMessage.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListContactMessagesQueryKey() });
        toast({ title: "DELETED", description: "Message removed." });
      },
      onError: () => toast({ title: "ERROR", description: "Failed to delete.", variant: "destructive" }),
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-black uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            MESSAGES
          </h1>
          <div className="w-16 h-[3px] bg-[#FFE600] mt-2" />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 border-[3px] border-black bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-0">
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                data-testid={`message-${msg.id}`}
                className={`border-[3px] border-black bg-white p-6 ${i > 0 ? "border-t-0" : ""}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-sm uppercase">{msg.name}</span>
                      {!msg.read && (
                        <span className="px-2 py-0.5 border-[2px] border-black bg-[#FF2D20] text-white text-xs font-bold uppercase">NEW</span>
                      )}
                    </div>
                    <a href={`mailto:${msg.email}`} className="font-mono text-xs text-gray-500 hover:text-black flex items-center gap-1">
                      <Mail size={10} />
                      {msg.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      data-testid={`button-delete-message-${msg.id}`}
                      className="p-2 border-[2px] border-[#FF2D20] text-[#FF2D20] hover:bg-[#FF2D20] hover:text-white transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="border-l-[3px] border-[#FFE600] pl-4">
                  <p className="font-mono text-sm text-gray-700 leading-relaxed">{msg.message}</p>
                </div>
                <div className="mt-3">
                  <a
                    href={`mailto:${msg.email}?subject=Re: Your message to OUTLAWZ LABS`}
                    className="inline-block border-[2px] border-black px-4 py-1 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    REPLY
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-[3px] border-black p-16 text-center bg-white">
            <Mail size={24} className="mx-auto mb-4 text-gray-400" />
            <p className="font-mono text-gray-500 uppercase tracking-wider text-sm">No messages yet</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
