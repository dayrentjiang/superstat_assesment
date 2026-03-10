import { UploadForm } from "@/components/upload/upload-form";

export default function UploadPage() {
  return (
    <div className="max-w-xl mx-auto w-full pt-4">
      <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 to-gray-600 mb-6 drop-shadow-sm ml-1">
        Upload Video
      </h1>
      <UploadForm />
    </div>
  );
}
