import { useEffect } from "react";
import Navbar from "@/components/navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Github } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  { icon: Mail, label: "EMAIL", value: "net2outlawzz@gmail.com", href: "mailto:net2outlawzz@gmail.com" },
  { icon: MessageSquare, label: "WHATSAPP", value: "+92 332 5195959", href: "https://wa.me/923325195959" },
  { icon: Github, label: "GITHUB", value: "github.com/0utLawzz", href: "https://github.com/0utLawzz" },
];

export default function Contact() {
  useEffect(() => {
    document.title = "Contact | OUTLAWZ LABS™";
  }, []);

  const { toast } = useToast();
  const submitContact = useSubmitContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = (data: ContactForm) => {
    submitContact.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "MESSAGE SENT", description: "I'll get back to you soon." });
        reset();
      },
      onError: () => {
        toast({ title: "ERROR", description: "Failed to send. Try emailing directly.", variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]" style={{ fontFamily: "'Space Mono', monospace" }}>
      <Navbar />

      {/* Header */}
      <section className="bg-black border-b-[3px] border-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-9xl font-bold text-white uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            CONTACT
          </h1>
          <div className="w-24 h-[3px] bg-[#FFE600] mt-4" />
          <p className="text-gray-400 font-mono text-sm mt-4">
            Have something to automate? Let's talk.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div>
            <h2 className="text-4xl font-bold uppercase mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              GET IN TOUCH
            </h2>
            <div className="space-y-0">
              {contactInfo.map((info, i) => (
                <a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  data-testid={`link-contact-${info.label.toLowerCase()}`}
                  className={`flex items-center gap-4 border-[3px] border-black p-6 bg-[#F5F0E8] hover:bg-[#FFE600] hover:text-black transition-colors group ${i > 0 ? "border-t-0" : ""}`}
                >
                  <div className="border-[3px] border-black p-3 bg-black text-white group-hover:bg-white group-hover:text-black transition-colors">
                    <info.icon size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-xs uppercase tracking-widest text-gray-500 group-hover:text-black/60 mb-1">{info.label}</div>
                    <div className="font-mono text-sm">{info.value}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability */}
            <div className="mt-8 border-[3px] border-black bg-[#FFE600] p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-[#00FF41] border border-black animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-widest">AVAILABILITY STATUS</span>
              </div>
              <p className="font-mono text-sm text-black/80">
                Currently open to new projects and automation consulting. Response time: 24-48 hours.
              </p>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-4xl font-bold uppercase mb-8" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              SEND A MESSAGE
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="border-[3px] border-black bg-white p-8 shadow-[6px_6px_0_#0A0A0A]">
              <div className="space-y-0">
                <div className="border-b-[3px] border-black">
                  <label className="block text-xs font-bold uppercase tracking-widest px-4 pt-4 pb-1 text-gray-500">
                    YOUR NAME
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="John Doe"
                    data-testid="input-contact-name"
                    className="w-full px-4 pb-4 font-mono text-sm focus:outline-none bg-transparent"
                  />
                  {errors.name && (
                    <p className="text-[#FF2D20] text-xs font-mono px-4 pb-2">{errors.name.message}</p>
                  )}
                </div>

                <div className="border-b-[3px] border-black">
                  <label className="block text-xs font-bold uppercase tracking-widest px-4 pt-4 pb-1 text-gray-500">
                    EMAIL
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="your@email.com"
                    data-testid="input-contact-email"
                    className="w-full px-4 pb-4 font-mono text-sm focus:outline-none bg-transparent"
                  />
                  {errors.email && (
                    <p className="text-[#FF2D20] text-xs font-mono px-4 pb-2">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest px-4 pt-4 pb-1 text-gray-500">
                    MESSAGE
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    placeholder="Describe what you need built..."
                    data-testid="input-contact-message"
                    className="w-full px-4 pb-4 font-mono text-sm focus:outline-none bg-transparent resize-none"
                  />
                  {errors.message && (
                    <p className="text-[#FF2D20] text-xs font-mono px-4 pb-2">{errors.message.message}</p>
                  )}
                </div>
              </div>

              <div className="border-t-[3px] border-black pt-6 mt-2">
                <button
                  type="submit"
                  disabled={submitContact.isPending}
                  data-testid="button-submit-contact"
                  className="w-full border-[3px] border-black bg-black text-white py-4 font-bold uppercase text-sm tracking-widest shadow-[4px_4px_0_#0A0A0A] hover:shadow-[2px_2px_0_#0A0A0A] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitContact.isPending ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t-[3px] border-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-gray-500 font-mono text-xs">© 2025 OUTLAWZ LABS™</span>
        </div>
      </footer>
    </div>
  );
}
