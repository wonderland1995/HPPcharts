import React, { useState, useRef } from "react";
import CableInstallationProgress from "./CableInstallationProgress";
import EITeamRadialDashboard from "./EITeamRadialDashboard";
import MHIProgress from "./MHIProgress";
import html2canvas from "html2canvas";

function App() {
  const [activeTab, setActiveTab] = useState("cables");
  const [installed, setInstalled] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [location, setLocation] = useState("6.6kV GT1");
  const [workType, setWorkType] = useState("Install");
  const [targetDate, setTargetDate] = useState("");
  const [showCableChart, setShowCableChart] = useState(false);
  const [subsystems, setSubsystems] = useState([
    { subsystem: "", total: "", open: "" },
  ]);

  const [showITRChart, setShowITRChart] = useState(false);
  const [pastedData, setPastedData] = useState("");

  // MHI Stuff
  const [mhiCategory, setMHICategory] = useState("Interconnects");
  const [mhiActivity, setMHIActivity] = useState("Install");
  const [mhiData, setMHIData] = useState([]);

  const chartRef = useRef(null);

  const handleDataPaste = (e) => {
    setPastedData(e.target.value);
  };

  const saveChartAsImage = (chartId) => {
    const chartElement = chartRef.current;
    const saveButton = chartElement.querySelector(".save-btn");

    if (saveButton) saveButton.style.display = "none";

    html2canvas(chartElement, {
      backgroundColor: "#FFFFFF",
      scale: 2,
      logging: false,
      useCORS: true,
    }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${chartId}.png`;
      link.click();

      if (saveButton) saveButton.style.display = "block";
    });
  };

  const processpastedData = () => {
    const rows = pastedData.trim().split("\n");
    const newSubsystems = rows.map((row) => {
      const [subsystem, total, open] = row.split("\t");
      return {
        subsystem: subsystem.trim(),
        total: total.trim(),
        open: open.trim(),
      };
    });
    setSubsystems(newSubsystems);
    setPastedData("");
  };

  const addSubsystemRow = () => {
    setSubsystems([...subsystems, { subsystem: "", total: "", open: "" }]);
  };
  //Handler for MHI
  const handleMHISubmit = (newData) => {
    setMHIData([...mhiData, newData]);
  };

  return (
    <div
      className="App"
      style={{
        textAlign: "center",
        paddingTop: "50px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 className="text-center text-4xl font-bold mb-6">Chart Generator</h1>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <button
          className={`tab ${activeTab === "cables" ? "active" : ""}`}
          onClick={() => setActiveTab("cables")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            marginRight: "10px",
            backgroundColor: activeTab === "cables" ? "#A8DADC" : "#F1FAEE",
            border: "2px solid #A8DADC",
            color: "#1D3557",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Cables
        </button>
        <button
          className={`tab ${activeTab === "itrs" ? "active" : ""}`}
          onClick={() => setActiveTab("itrs")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            marginRight: "10px",
            backgroundColor: activeTab === "itrs" ? "#F4A261" : "#F1FAEE",
            border: "2px solid #F4A261",
            color: "#1D3557",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          ITRs
        </button>
        <button
          className={`tab ${activeTab === "mhi" ? "active" : ""}`}
          onClick={() => setActiveTab("mhi")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            backgroundColor: activeTab === "mhi" ? "#F1C40F" : "#F1FAEE",
            border: "2px solid #F1C40F",
            color: "#1D3557",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          MHI
        </button>
      </div>

      {/* Cables Tab */}
      {activeTab === "cables" && (
        <div
          className="cables-tab-content"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <h2 className="text-xl font-bold mb-4">
            Cable Installation Progress
          </h2>

          <div
            className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8"
            style={{ textAlign: "left", backgroundColor: "#FAFAFA" }}
          >
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="6.6kV GT1">6.6kV GT1</option>
                <option value="SFC GT1">SFC GT1</option>
                <option value="AUX GT1">AUX GT1</option>
                <option value="EXCITATION GT1">EXCITATION GT1</option>
                <option value="6.6kV GT1">6.6kV GT2</option>
                <option value="SFC GT1">SFC GT2</option>
                <option value="AUX GT1">AUX GT2</option>
                <option value="EXCITATION GT2">EXCITATION GT2</option>
                <option value="Sitewide Fibre">Fibre</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Activity</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Install">Install</option>
                <option value="Terminate">Terminate</option>
                <option value="Test">Test</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Cables {workType}ed
              </label>
              <input
                type="number"
                value={installed}
                onChange={(e) => setInstalled(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Cables Remaining
              </label>
              <input
                type="number"
                value={remaining}
                onChange={(e) => setRemaining(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Target Date Input */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <button
              onClick={() => setShowCableChart(true)}
              className="bg-green-500 text-white py-2 px-4 rounded"
              style={{ marginTop: "10px" }}
            >
              Generate Cable Chart
            </button>
          </div>

          {showCableChart && (
            <div
              id="cable-chart"
              ref={chartRef}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
              }}
            >
              <CableInstallationProgress
                title={`${location} Cable ${workType} Progress`}
                installed={installed}
                remaining={remaining}
                total={parseInt(installed) + parseInt(remaining)}
                workType={workType}
                targetDate={targetDate}
              />
              <button
                onClick={() => saveChartAsImage("cable-chart")}
                className="bg-blue-500 text-white py-2 px-4 rounded save-btn mt-4"
              >
                Save Chart as Image
              </button>
            </div>
          )}
        </div>
      )}

      {/* ITRs Tab */}
      {activeTab === "itrs" && (
        <div
          className="itrs-tab-content"
          style={{ width: "95%", maxWidth: "1800px", margin: "0 auto" }}
        >
          <h2 className="text-xl font-bold mb-4">Subsystems and ITRs</h2>

          {/* Paste Data Section */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Paste Data</h3>
            <p className="text-sm mb-2">
              Paste your data in the format: Subsystem [Tab] Total ITRs [Tab]
              Open ITRs
              <br />
              Each row should be on a new line.
            </p>
            <textarea
              value={pastedData}
              onChange={handleDataPaste}
              className="w-full h-40 p-2 border border-gray-300 rounded mb-2"
              placeholder="Example:
Subsystem1  100  75
Subsystem2  150  120
Subsystem3  80  60"
            />
            <button
              onClick={processpastedData}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Process Pasted Data
            </button>
          </div>

          {/* Manual input section */}
          <div
            className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mb-8"
            style={{ textAlign: "left", backgroundColor: "#FAFAFA" }}
          >
            {subsystems.map((subsystem, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="Subsystem"
                  value={subsystem.subsystem}
                  onChange={(e) => {
                    const updatedSubsystems = [...subsystems];
                    updatedSubsystems[index].subsystem = e.target.value;
                    setSubsystems(updatedSubsystems);
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={{ marginRight: "10px" }}
                />
                <input
                  type="number"
                  placeholder="Total ITRs"
                  value={subsystem.total}
                  onChange={(e) => {
                    const updatedSubsystems = [...subsystems];
                    updatedSubsystems[index].total = e.target.value;
                    setSubsystems(updatedSubsystems);
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                  style={{ marginRight: "10px" }}
                />
                <input
                  type="number"
                  placeholder="Open ITRs"
                  value={subsystem.open}
                  onChange={(e) => {
                    const updatedSubsystems = [...subsystems];
                    updatedSubsystems[index].open = e.target.value;
                    setSubsystems(updatedSubsystems);
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
            <button
              onClick={addSubsystemRow}
              className="bg-blue-500 text-white py-2 px-4 rounded"
              style={{
                marginTop: "10px",
                display: "block",
                marginLeft: "auto",
              }}
            >
              +
            </button>
          </div>

          <div className="max-w-md mx-auto mb-6">
            <button
              onClick={() => setShowITRChart(true)}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Generate ITR Chart
            </button>
          </div>

          {showITRChart && (
            <div
              id="itr-chart"
              ref={chartRef}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
                width: "100%",
              }}
            >
              <EITeamRadialDashboard data={subsystems} />
              <button
                onClick={() => saveChartAsImage("itr-chart")}
                className="bg-blue-500 text-white py-2 px-4 rounded save-btn mt-4"
              >
                Save Chart as Image
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "mhi" && (
        <div
          className="mhi-tab-content"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <h2 className="text-xl font-bold mb-4">MHI Progress</h2>

          <div className="flex justify-center space-x-4 mb-4">
            <select
              value={mhiCategory}
              onChange={(e) => setMHICategory(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="Interconnects">Interconnects</option>
              <option value="Field">Field</option>
              <option value="Total">Total</option>
            </select>
            <select
              value={mhiActivity}
              onChange={(e) => setMHIActivity(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="Install">Install</option>
              <option value="Termination">Termination</option>
              <option value="Test">Test</option>
            </select>
          </div>

          <MHIProgress
            category={mhiCategory}
            activity={mhiActivity}
            data={mhiData}
            onSubmit={handleMHISubmit}
          />
        </div>
      )}
    </div>
  );
}

export default App;
