import { useRef, useState } from "react";
import { FileText, Loader2, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";

export default function DocumentUploadInput({ value, onChange, label = "Upload document" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = () => !uploading && inputRef.current?.click();

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF, JPG, PNG or WEBP files are allowed.");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be 10MB or smaller.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    setUploading(true);
    try {
      const { data } = await api.post("/uploads/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data?.data?.url, file.name);
      toast.success("Document uploaded successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to upload document");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-ink block mb-1">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileSelected}
        disabled={uploading}
      />
      {value ? (
        <div className="flex items-center justify-between gap-2 border border-sand rounded-xl px-4 py-3 bg-mint/10">
          <a href={value} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-forest font-medium truncate">
            <FileText size={16} /> View uploaded document
          </a>
          <button type="button" onClick={() => onChange("", "")} className="text-coral" aria-label="Remove document">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={pickFile}
          disabled={uploading}
          className="w-full h-20 rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center gap-1 text-muted hover:border-emerald hover:text-emerald transition-colors"
        >
          {uploading ? (
            <><Loader2 size={18} className="animate-spin" /> Uploading...</>
          ) : (
            <><Upload size={18} /> <span className="text-xs">PDF, JPG or PNG, up to 10MB</span></>
          )}
        </button>
      )}
    </div>
  );
}
