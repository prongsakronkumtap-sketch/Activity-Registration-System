// src/components/StatusMessage.jsx
function StatusMessage({ type = "info", message }) {
  let bgColor = "#e8f0fe";
  let textColor = "#174ea6";
  let borderColor = "#4285f4";

  if (type === "success") {
    bgColor = "#e6f4ea";
    textColor = "#137333";
    borderColor = "#34a853";
  } else if (type === "error") {
    bgColor = "#fce8e6";
    textColor = "#a50e0e";
    borderColor = "#ea4335";
  } else if (type === "loading") {
    bgColor = "#fef7e0";
    textColor = "#b06000";
    borderColor = "#fbbc05";
  }

  return (
    <div style={{ background: bgColor, color: textColor, padding: "14px 18px", borderRadius: "10px", border: `1px solid ${borderColor}`, margin: "10px 0", fontWeight: "bold", textAlign: "center" }}>
      {message}
    </div>
  );
}

export default StatusMessage;