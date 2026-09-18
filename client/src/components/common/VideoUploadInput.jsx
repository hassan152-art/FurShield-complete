import { useRef, useState } from "react";
import { Video, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";

export default function VideoUploadInput({ value, onChange, label = "Pet video (optional)" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = () => inputRef.current?.click();

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("video", file);
    setUploading(true);
    try {
      const { data } = await api.post("/uploads/video", formData);
      onChange(data.data.url);
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to upload video");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <label className="text-sm font-medium text-ink block mb-1">{label}</label>
      <input ref={inputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={onFileSelected} />
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-sand">
          <video src={value} controls className="w-full h-40 object-cover bg-black" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 hover:bg-white"
            aria-label="Remove video"
          >
            <X size={14} className="text-coral" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={pickFile}
          disabled={uploading}
          className="w-full h-24 rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center gap-2 text-muted hover:border-emerald hover:text-emerald transition-colors"
        >
          {uploading ? (
            <><Loader2 size={20} className="animate-spin" /> Uploading...</>
          ) : (
            <><Video size={20} /> <span className="text-sm">Click to upload a short video</span></>
          )}
        </button>
      )}
      {!value && !uploading && <p className="text-xs text-muted mt-1">MP4, WEBM or MOV, up to 30MB</p>}
    </div>
  );
}
