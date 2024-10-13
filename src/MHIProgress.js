import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MHIProgress = ({ category, activity, data, onSubmit }) => {
  const [formData, setFormData] = useState({
    installed: "",
    remaining: "",
    targetDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = parseInt(formData.installed) + parseInt(formData.remaining);
    const percentComplete = (
      (parseInt(formData.installed) / total) *
      100
    ).toFixed(2);
    const today = new Date();
    const targetDate = new Date(formData.targetDate);
    const daysUntilTarget = Math.ceil(
      (targetDate - today) / (1000 * 60 * 60 * 24)
    );
    const dailyTarget = (formData.remaining / daysUntilTarget).toFixed(2);

    onSubmit({
      installed: parseInt(formData.installed),
      remaining: parseInt(formData.remaining),
      total,
      targetDate: formData.targetDate,
      percentComplete: parseFloat(percentComplete),
      dailyTarget: parseFloat(dailyTarget),
    });

    setFormData({
      installed: "",
      remaining: "",
      targetDate: "",
    });
  };

  const ProgressBar = ({ percent }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );

  // Get the most recent data entry
  const latestData = data.length > 0 ? data[data.length - 1] : null;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Form to add progress data */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="installed"
            value={formData.installed}
            onChange={handleChange}
            placeholder="Cables Installed"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="remaining"
            value={formData.remaining}
            onChange={handleChange}
            placeholder="Cables Remaining"
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Data
          </button>
        </div>
      </form>
      <h2 className="text-2xl font-bold mb-4 text-center">
        MHI {category} {activity} Progress
      </h2>
      {/* Display the most recent progress data if available */}
      {latestData ? (
        <div className="mb-12">
          <div className="mb-4">
            <p className="text-lg">Total Cables: {latestData.total}</p>
            <div className="flex justify-between items-center mt-2">
              <span>Progress:</span>
              <span className="font-bold text-blue-600">
                {latestData.percentComplete}% Complete
              </span>
            </div>
            <ProgressBar percent={latestData.percentComplete} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded">
              <p className="text-sm">Installed</p>
              <p className="text-2xl font-bold text-green-600">
                {latestData.installed}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              <p className="text-sm">Remaining</p>
              <p className="text-2xl font-bold text-yellow-600">
                {latestData.remaining}
              </p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Installed", value: latestData.installed },
                  { name: "Remaining", value: latestData.remaining },
                ]}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[0, latestData.total]}
                  ticks={[
                    0,
                    Math.floor(latestData.total / 2),
                    latestData.total,
                  ]}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fill: "#333", fontSize: 14 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Cables" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Target Information</h4>
            <p>Target Date: {latestData.targetDate}</p>
            <p>Qty/Day to complete by Target date: {latestData.dailyTarget}</p>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No data available. Please add data using the form above.
        </p>
      )}
    </div>
  );
};

export default MHIProgress;
