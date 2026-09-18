import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";
import Button from "../../components/ui/Button.jsx";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success("Message sent! We will get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
      <div>
        <h1 className="text-3xl font-extrabold text-forest">Contact Us</h1>
        <p className="text-muted mt-3">We would love to hear from you.</p>
        <div className="mt-8 space-y-3 text-sm text-muted">
          <p>Email: support@furshield.com</p>
          <p>Phone: +92 300 0000000</p>
          <p>Address: Karachi, Pakistan</p>
        </div>
        <div className="mt-8 aspect-video rounded-2xl overflow-hidden border border-sand">
          <iframe
            title="FurShield location"
            src="https://www.google.com/maps?q=Karachi,Pakistan&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-8 shadow-sm space-y-4 h-fit">
        <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-sand rounded-xl px-4 py-3" />
        <input required type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-sand rounded-xl px-4 py-3" />
        <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-sand rounded-xl px-4 py-3" />
        <textarea required rows={5} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-sand rounded-xl px-4 py-3" />
        <Button type="submit" disabled={loading} className="w-full justify-center">
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
