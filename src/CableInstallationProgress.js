import React, { useState, useEffect } from "react";
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
import { differenceInDays, parseISO } from "date-fns"; // import date-fns for date manipulation

const CableInstallationProgress = ({
  title,
  installed,
  remaining,
  total,
  workType,
  targetDate, // Accept targetDate prop
}) => {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [dailyTarget, setDailyTarget] = useState(0);

  useEffect(() => {
    if (targetDate) {
      const currentDate = new Date();
      const endTargetDate = parseISO(targetDate); // Parse the target date
      const remainingDays = differenceInDays(endTargetDate, currentDate) + 1; // Add 1 to include today
      setDaysRemaining(remainingDays);

      const qtyRemaining = total - installed;
      if (remainingDays > 0 && qtyRemaining > 0) {
        const calculatedDailyTarget = qtyRemaining / remainingDays;
        setDailyTarget(calculatedDailyTarget.toFixed(2)); // Set daily target rounded to 2 decimal places
      }
    }
  }, [targetDate, total, installed]);

  const data = [
    {
      name: workType === "Install" ? "Installed" : "Complete",
      value: installed,
    },
    { name: "Remaining", value: remaining },
  ];

  const maxValue = Math.max(installed, remaining);

  const ProgressBar = ({ percent }) => (
    <div className="progress-bar-container" style={{ marginTop: "10px" }}>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full dark:bg-blue-500"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );

  const percentComplete = (installed / total) * 100 || 0;

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

      <div className="mb-4">
        <p className="text-lg font-semibold">
          Total Cables to {workType}: {total}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span>Progress:</span>
          <span className="font-bold text-blue-600">
            {percentComplete.toFixed(2)}% Complete
          </span>
        </div>
        <ProgressBar percent={percentComplete} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 p-3 rounded">
          <p className="text-sm">Installed/Complete</p>
          <p className="text-2xl font-bold text-green-600">{installed}</p>
        </div>
        <div className="bg-yellow-100 p-3 rounded">
          <p className="text-sm">Remaining</p>
          <p className="text-2xl font-bold text-yellow-600">
            {remaining >= 0 ? remaining : 0}
          </p>
        </div>
      </div>

      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Target Information</h4>
        <p>Target Date: {targetDate ? targetDate : "No target date set"}</p>
        <p>
          Days Remaining:{" "}
          {daysRemaining > 0 ? daysRemaining : "Target date passed"}
        </p>
        <p>
          Qty/Day to complete by Target date:{" "}
          {dailyTarget > 0
            ? dailyTarget
            : "No work remaining or insufficient data"}
        </p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, total]}
              ticks={[0, Math.ceil(total / 2), total]}
            />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Cables" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CableInstallationProgress;
