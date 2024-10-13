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

const InterconnectProgress = ({ category, activity, data, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    total: "",
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
    const percentComplete = (
      (parseInt(formData.installed) / parseInt(formData.total)) *
      100
    ).toFixed(2);
    const today = new Date();
    const targetDate = new Date(formData.targetDate);
    const daysUntilTarget = Math.ceil(
      (targetDate - today) / (1000 * 60 * 60 * 24)
    );
    const dailyTarget = (formData.remaining / daysUntilTarget).toFixed(2);

    onSubmit({
      ...formData,
      percentComplete: parseFloat(percentComplete),
      dailyTarget: parseFloat(dailyTarget),
    });

    setFormData({
      name: "",
      total: "",
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {category} {activity} Progress
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name (e.g., Cables, Terminations)"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="total"
            value={formData.total}
            onChange={handleChange}
            placeholder="Total"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="installed"
            value={formData.installed}
            onChange={handleChange}
            placeholder={`${activity}ed`}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="remaining"
            value={formData.remaining}
            onChange={handleChange}
            placeholder="Remaining"
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

      {data.map((item, index) => (
        <div key={index} className="mb-12">
          <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
          <div className="mb-4">
            <p className="text-lg">Total: {item.total}</p>
            <div className="flex justify-between items-center mt-2">
              <span>Progress:</span>
              <span className="font-bold text-blue-600">
                {item.percentComplete.toFixed(2)}% Complete
              </span>
            </div>
            <ProgressBar percent={item.percentComplete} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded">
              <p className="text-sm">{activity}ed</p>
              <p className="text-2xl font-bold text-green-600">
                {item.installed}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              <p className="text-sm">Remaining</p>
              <p className="text-2xl font-bold text-yellow-600">
                {item.remaining}
              </p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: `${activity}ed`, value: parseInt(item.installed) },
                  { name: "Remaining", value: parseInt(item.remaining) },
                ]}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fill: "#333", fontSize: 14 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name={`${activity}ed`} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Target Information</h4>
            <p>Target Date: {item.targetDate}</p>
            <p>
              {activity} Qty/Day to complete by Target date:{" "}
              {item.dailyTarget.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterconnectProgress;
