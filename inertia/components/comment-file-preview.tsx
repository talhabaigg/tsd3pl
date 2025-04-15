const FilePreview = ({ file }: { file: File | string }) => {
  // Logic for rendering file preview
  const renderFilePreview = (file: File | string | null) => {
    if (!file) return null;

    // If file is a string and starts with https://, it's a URL (e.g., S3 URL)
    const isFullUrl = typeof file === "string" && file.startsWith("https://");
    const fileUrl = isFullUrl
      ? file
      : file instanceof File
      ? URL.createObjectURL(file) // For file objects, create a temporary URL
      : `${window.location.origin}/storage/${file}`; // Assuming file path

    const isFileObject = file instanceof File;
    const fileType = isFileObject
      ? file.type.split("/")[0]
      : file.split(".").pop()?.toLowerCase();

    // Common link to open the file
    const fileLink = (
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline text-sm"
      >
        View File
      </a>
    );

    if (
      fileType === "image" ||
      ["png", "jpg", "jpeg", "gif", "svg"].includes(fileType ?? "")
    ) {
      return (
        <div>
          <img
            src={fileUrl}
            alt="Uploaded"
            className="w-full max-h-64 rounded-lg object-contain border p-1"
          />
          <div className="mt-2">{fileLink}</div>
        </div>
      );
    }

    if (
      fileType === "video" ||
      ["mp4", "avi", "mov"].includes(fileType ?? "")
    ) {
      return (
        <div>
          <video controls className="w-full max-h-64">
            <source src={fileUrl} type={`video/${fileType}`} />
            Your browser does not support the video tag.
          </video>
          <div className="mt-2">{fileLink}</div>
        </div>
      );
    }

    if (fileType === "pdf") {
      return (
        <div>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-sm"
          >
            <img
              src="/PDF_file_icon.svg"
              className="w-24 h-24 -ml-2"
              alt="pdf image"
            />
            View PDF
          </a>
          <div className="mt-2">{fileLink}</div>
        </div>
      );
    }

    return (
      <div>
        <span className="text-gray-500">File attached</span>
        <div className="mt-2">{fileLink}</div>
      </div>
    );
  };

  return <div>{renderFilePreview(file)}</div>;
};

export { FilePreview };
