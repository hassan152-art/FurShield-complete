import { useRef, useState } from "react";
import { Upload, ImageOff, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";

export default function ImageUploadInput({
  value,
  onChange,
  label = "Pet / product photo",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = () => {
    if (!uploading) {
      inputRef.current?.click();
    }
  };

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Allowed image types
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const { data } = await api.post(
        "/uploads/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = data?.data?.url;

      if (!imageUrl) {
        throw new Error("Image URL was not returned by server.");
      }

      onChange(imageUrl);

      toast.success("Image uploaded successfully.");
    } catch (err) {
      console.error("Image upload error:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to upload image"
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();

    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Label */}
      <label className="text-lg font-semibold text-ink block mb-2">
        {label}
      </label>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.jfif,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={onFileSelected}
        disabled={uploading}
      />

      {/* Upload / Preview Box */}
      {value ? (
        <div
          onClick={pickFile}
          className="relative w-full h-[240px] rounded-2xl overflow-hidden border-2 border-dashed border-sand cursor-pointer group"
        >
          <img
            src={value}
            alt="Selected pet"
            className="w-full h-full object-cover"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white rounded-xl px-5 py-2 text-sm font-semibold text-forest shadow">
              Click to change image
            </span>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-3 right-3 bg-white/95 rounded-full p-2 shadow-md hover:bg-white transition"
            aria-label="Remove image"
          >
            <X size={16} className="text-coral" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={pickFile}
          disabled={uploading}
          className="w-full h-[240px] rounded-2xl border-2 border-dashed border-sand bg-white flex flex-col items-center justify-center gap-4 text-muted hover:border-emerald hover:text-emerald hover:bg-mint/10 transition-all"
        >
          {uploading ? (
            <>
              <Loader2
                size={36}
                className="animate-spin text-emerald"
              />

              <span className="text-lg">
                Uploading image...
              </span>
            </>
          ) : (
            <>
              <Upload
                size={36}
                strokeWidth={2}
                className="text-muted"
              />

              <span className="text-lg">
                Click to upload from your device
              </span>
            </>
          )}
        </button>
      )}

      {/* File information */}
      {!value && !uploading && (
        <p className="text-base text-muted mt-2 flex items-center gap-2">
          <ImageOff size={17} />
          JPG, PNG or WEBP, up to 5MB
        </p>
      )}
    </div>
  );
}