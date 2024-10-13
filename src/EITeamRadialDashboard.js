import React from "react";

const generateColor = (index) => {
  const hue = (index * 137.508) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const ProgressBar = ({ percentage, color }) => (
  <div
    style={{
      width: "100%",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: `${percentage}%`,
        height: "10px",
        backgroundColor: color,
        transition: "width 0.5s ease-in-out",
      }}
    />
  </div>
);

const EITeamDashboard = ({ data }) => {
  const processedData = data.map((item, index) => {
    const total = parseInt(item.total) || 0;
    const open = parseInt(item.open) || 0;
    const closed = total - open;
    return {
      ...item,
      total: total,
      open: open,
      closed: closed,
      color: generateColor(index),
      completionPercentage: total > 0 ? (closed / total) * 100 : 0,
    };
  });

  const totalITRs = processedData.reduce((sum, item) => sum + item.total, 0);
  const openITRs = processedData.reduce((sum, item) => sum + item.open, 0);
  const closedITRs = totalITRs - openITRs;
  const completionPercentage =
    totalITRs > 0 ? (closedITRs / totalITRs) * 100 : 0;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#f9f9f9",
        padding: "15px",
        fontFamily: "Arial, sans-serif",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "20px",
          marginBottom: "15px",
          color: "#333",
        }}
      >
        E&I Team Progress Dashboard
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          padding: "10px",
          backgroundColor: "white",
          borderRadius: "4px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ width: "60%" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "25px" }}>
            Overall Completion
          </h3>
          <ProgressBar percentage={completionPercentage} color="#00C49F" />
          <div
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              color: "#00C49F",
              marginTop: "5px",
            }}
          >
            {completionPercentage.toFixed(1)}%
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "14px" }}>
          <p>Total ITRs: {totalITRs}</p>
          <p>Open ITRs: {openITRs}</p>
          <p>Closed ITRs: {closedITRs}</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {processedData.map((item, index) => (
          <div
            key={index}
            style={{
              width: "calc(20% - 8px)",
              marginBottom: "10px",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              fontSize: "12px",
            }}
          >
            <h4
              style={{
                fontSize: "14px",
                marginBottom: "5px",
                color: item.color,
              }}
            >
              {item.subsystem}
            </h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span>Total: {item.total}</span>
              <span>Open: {item.open}</span>
            </div>
            <div
              style={{
                textAlign: "right",
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              {item.completionPercentage.toFixed(1)}%
            </div>
            <ProgressBar
              percentage={item.completionPercentage}
              color={item.color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EITeamDashboard;
