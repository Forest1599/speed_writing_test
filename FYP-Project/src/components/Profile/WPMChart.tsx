import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type WPMChartProps = {
  data: { date: string; wpm: number }[] | undefined;
};

const WPMChart: React.FC<WPMChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] bg-gray-800 p-6 rounded-xl mt-8 shadow-md text-white relative mb-5">
        <h3 className="text-xl text-center font-bold mb-4">WPM Over Time</h3>

        <p className="absolute top-7 right-6 text-sm text-gray-400">Last 30 sessions</p>

        {data?.length === 0 ? (
        <div className="flex items-center justify-center h-[90%] text-gray-400 text-lg">
            No typing sessions yet!
        </div>
        ) : (
        <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" tickMargin={10} />
            <YAxis stroke="#ccc" domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
            <Line
                type="monotone"
                dataKey="wpm"
                stroke="#f87171"
                strokeWidth={2}
                dot={{ r: 3 }}
            />
            </LineChart>
        </ResponsiveContainer>
        )}
    </div>
  );
};

export default WPMChart;