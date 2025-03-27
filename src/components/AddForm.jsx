import React, { useState } from "react";
import { uploadFilesToAzure, submitTicket } from "../api/ticketService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/addForm.css";

const AddForm = ({ category, onBack, user }) => {
  const [formData, setFormData] = useState({
    description: "",
    comments: "",
    attachments: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    // Prevent duplicate file selection
    const uniqueFiles = newFiles.filter(
      (file) => !formData.attachments.some((existing) => existing.name === file.name)
    );

    if (uniqueFiles.length < newFiles.length) {
      toast.warn("Some files are already selected.");
    }

    setFormData({ ...formData, attachments: [...formData.attachments, ...uniqueFiles] });

    // Reset file input to allow re-uploading the same file
    e.target.value = "";
  };

  const handleRemoveAttachment = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      attachments: prevState.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.comments.trim() || !formData.description.trim()) {
      setMessage("Please fill in all mandatory fields.");
      toast.error("Please fill in all mandatory fields.");
      setLoading(false);
      return;
    }

    try {
      let attachmentUrls = await uploadFilesToAzure(formData.attachments);

      const ticketData = {
        UserId: user?.UserId,
        AdminId: 1,
        Description: formData.description,
        Status: "Open",
        Comments: formData.comments,
        Attachment: attachmentUrls,
      };

      await submitTicket(ticketData);
      toast.success("Ticket submitted successfully!");
      setFormData({ description: "", comments: "", attachments: [] });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-form-container">
      <ToastContainer />
      <h3 className="form-title">{category ? `${category} Request Form` : "Request Form"}</h3>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Requestor *</label>
          <div className="requestor-container">
            <div className="requestor-icon">{user?.UserName?.charAt(0).toUpperCase()}</div>
            <div>
              <div className="requestor-text">{user?.UserName?.toUpperCase() || "N/A"} (WinWire)</div>
              <div className="requestor-info">WinWire Employee - Full Time</div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Summary *</label>
          <input
            type="text"
            name="comments"
            className="form-control"
            placeholder="Enter summary"
            value={formData.comments}
            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Details *</label>
          <textarea
            name="description"
            className="form-control"
            rows="4"
            placeholder="Enter detailed description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* Attachments */}
        <div className="form-group">
          <label className="form-label">Attachments</label>
          <div className="file-upload-box">
            <input type="file" multiple className="file-input" onChange={handleFileChange} />
          </div>

          {formData.attachments.length > 0 && (
            <ul className="selected-files">
              {formData.attachments.map((file, index) => (
                <li key={index} className="file-name">
                  {file.name}
                  <span className="remove-file" onClick={() => handleRemoveAttachment(index)}> ✖ </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-buttons">
          <button type="button" className="btn btn-secondary back-btn" onClick={onBack}>← Back</button>
          <button type="submit" className="btn btn-success submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
