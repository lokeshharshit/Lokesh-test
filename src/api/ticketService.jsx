import axios from "axios";

const apiUrl = "https://ticketfunctionrbac-apim.azure-api.net/ticketingsystemfc/ticketsystrigger";
const sasToken = "sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiyx&se=2025-04-20T15:28:36Z&st=2025-03-19T07:28:36Z&spr=https,http&sig=G2q4%2BGr3XGUGKb%2Ba0FL9C5MhlEtlv8Z%2BOn2hrIJPVdA%3D";
const blobStorageUrl = "https://ticketingsystemfctickets.blob.core.windows.net/ticketingsystemfccontainer";

export const uploadFilesToAzure = async (files) => {
  if (files.length === 0) return null;

  let uploadedUrls = [];
  for (const file of files) {
    const blobName = `${Date.now()}-${file.name}`;
    const uploadUrl = `${blobStorageUrl}/${blobName}?${sasToken}`;

    try {
      await axios.put(uploadUrl, file, {
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
      });
      uploadedUrls.push(`${blobStorageUrl}/${blobName}`);
    } catch (error) {
      console.error(`File upload failed for ${file.name}:`, error);
      throw new Error(`Failed to upload ${file.name}`);
    }
  }

  return uploadedUrls.length > 0 ? uploadedUrls.join(";") : null;
};

export const submitTicket = async (ticketData) => {
  try {
    const response = await axios.post(apiUrl, ticketData, {
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "API request failed");
  }
};
