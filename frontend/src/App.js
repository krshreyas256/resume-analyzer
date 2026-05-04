import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null); // Clear previous results
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Upload failed! Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e"; // Green
    if (score >= 60) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "success":
        return "#22c55e";
      default:
        return "#6b7280";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return "⚠️";
      case "medium":
        return "💡";
      case "success":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: "#f9fafb"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}>
        <h1 style={{ color: "#1f2937", marginBottom: "10px" }}>
          🎯 AI Powered Resume Analyzer
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>
          Upload your resume to get instant ATS score and improvement suggestions
        </p>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input 
            type="file" 
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            style={{
              padding: "10px",
              border: "2px solid #e5e7eb",
              borderRadius: "6px",
              flex: 1
            }}
          />
          <button 
            onClick={handleUpload} 
            disabled={loading}
            style={{ 
              padding: "10px 24px",
              backgroundColor: loading ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>
      </div>

      {result && (
        <div>
          {/* ATS Score Card */}
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>
              ATS Score
            </h2>
            <div style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              border: `10px solid ${getScoreColor(result.analysis.ats_score)}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px"
            }}>
              <div style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: getScoreColor(result.analysis.ats_score)
              }}>
                {result.analysis.ats_score}
              </div>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>/ 100</div>
            </div>
            <div style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: getScoreColor(result.analysis.ats_score),
              marginBottom: "10px"
            }}>
              {getScoreLabel(result.analysis.ats_score)}
            </div>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              File: {result.filename}
            </p>
          </div>

          {/* Suggestions */}
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginBottom: "20px"
          }}>
            <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>
              💡 Improvement Suggestions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {result.analysis.suggestions.map((suggestion, idx) => (
                <div key={idx} style={{
                  padding: "16px",
                  border: `2px solid ${getSeverityColor(suggestion.severity)}`,
                  borderRadius: "8px",
                  backgroundColor: `${getSeverityColor(suggestion.severity)}10`
                }}>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    <span style={{ fontSize: "20px" }}>
                      {getSeverityIcon(suggestion.severity)}
                    </span>
                    <strong style={{ color: getSeverityColor(suggestion.severity) }}>
                      {suggestion.category}
                    </strong>
                  </div>
                  <p style={{ margin: 0, color: "#374151" }}>
                    {suggestion.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Information */}
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginBottom: "20px"
          }}>
            <h2 style={{ marginBottom: "20px", color: "#1f2937" }}>
              📊 Extracted Information
            </h2>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "20px"
            }}>
              <div>
                <h3 style={{ color: "#1f2937", marginBottom: "10px" }}>
                  🛠️ Skills ({result.analysis.skills.length})
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {result.analysis.skills.length > 0 ? (
                    result.analysis.skills.map((skill, idx) => (
                      <span key={idx} style={{
                        padding: "6px 12px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        borderRadius: "20px",
                        fontSize: "14px"
                      }}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#6b7280" }}>No skills detected</span>
                  )}
                </div>
              </div>

              <div>
                <h3 style={{ color: "#1f2937", marginBottom: "10px" }}>
                  📧 Contact Information
                </h3>
                <p><strong>Email:</strong> {result.analysis.emails.join(", ") || "None found"}</p>
                <p><strong>Phone:</strong> {result.analysis.phones.join(", ") || "None found"}</p>
              </div>

              {result.analysis.names && result.analysis.names.length > 0 && (
                <div>
                  <h3 style={{ color: "#1f2937", marginBottom: "10px" }}>
                    👤 Names Detected
                  </h3>
                  <p>{result.analysis.names.join(", ")}</p>
                </div>
              )}

              {result.analysis.organizations && result.analysis.organizations.length > 0 && (
                <div>
                  <h3 style={{ color: "#1f2937", marginBottom: "10px" }}>
                    🏢 Organizations
                  </h3>
                  <p>{result.analysis.organizations.join(", ")}</p>
                </div>
              )}
            </div>

            <details style={{ marginTop: "20px" }}>
              <summary style={{ 
                cursor: "pointer", 
                padding: "10px",
                backgroundColor: "#f3f4f6",
                borderRadius: "6px",
                fontWeight: "bold"
              }}>
                📄 View Full Resume Text
              </summary>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  border: "1px solid #e5e7eb",
                  padding: "16px",
                  marginTop: "10px",
                  maxHeight: "400px",
                  overflowY: "auto",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              >
                {result.text_snippet}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
