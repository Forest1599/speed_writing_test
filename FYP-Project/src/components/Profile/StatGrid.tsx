import React from 'react';

type StatGridProps = {
  stats: {
    average_wpm: number;
    average_accuracy: number;
    highest_wpm: number;
    total_sessions: number;
  } | undefined;
};

const StatGrid: React.FC<StatGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
      <div>
        <p className="text-2xl font-bold">Avg. WPM</p>
        <p className="text-3xl text-gray-300">{stats?.average_wpm}</p>
      </div>

      <div>
        <p className="text-2xl font-bold">Sessions</p>
        <p className="text-3xl text-gray-300">{stats?.total_sessions}</p>
      </div>

      <div>
        <p className="text-2xl font-bold">Highest WPM</p>
        <p className="text-3xl text-gray-300">{stats?.highest_wpm}</p>
      </div>

      <div>
        <p className="text-2xl font-bold">Avg. Accuracy%</p>
        <p className="text-3xl text-gray-300">{stats?.average_accuracy}</p>
      </div>
    </div>
  );
};

export default StatGrid;