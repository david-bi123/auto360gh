"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { whatsappLink } from "@/lib/services/settings";
import type { BusinessSettings } from "@/types";

export function ContactForm({ settings }: { settings: BusinessSettings }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast("Please fill in all fields", { type: "error" });
      return;
    }
    setSending(true);
    const text = `Hello Auto360 Gh, my name is ${form.name}.\nPhone: ${form.phone || "not provided"}\n\n${form.message}`;
    window.open(whatsappLink(settings, text), "_blank");
    setSending(false);
    toast("Opening WhatsApp…", { description: "Complete your message there and we will reply shortly." });
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-carbon-200 bg-white p-6 shadow-card sm:p-8">
      <div>
        <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-carbon-900">Send us a message</h2>
        <p className="mt-1 text-sm text-carbon-500">We usually reply within a few hours during opening times.</p>
      </div>
      <Field label="Your name" required>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Kwame Mensah" />
      </Field>
      <Field label="Phone number">
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 024 000 0000" />
      </Field>
      <Field label="Message" required>
        <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
      </Field>
      <Button type="submit" size="lg" className="w-full" loading={sending} leftIcon={<Send className="h-4 w-4" />}>
        Send via WhatsApp
      </Button>
      <p className="text-center text-xs text-carbon-400">
        Your message opens in WhatsApp — no chat history is stored on this site.
      </p>
    </form>
  );
}