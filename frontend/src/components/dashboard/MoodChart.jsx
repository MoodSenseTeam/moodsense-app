import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { moodChartData } from "../../data/dashboardData";

const moodLabels = {
  1: "Buruk",
  2: "Kurang",
  3: "Biasa",
  4: "Baik",
  5: "Luar Biasa",
};

function MoodChart() {
  return (
    <section className="rounded-2xl border border-[#e2e8e4] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium text-[#1f3f31] dark:text-white">Tren Mingguan</h2>

          <p className="text-sm text-[#60766b] dark:text-slate-300">Skor mood harian</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#1f3f31] dark:text-slate-300">
          <span className="h-2 w-2 rounded-full bg-[#2b6a4f] dark:bg-emerald-400" />
          Mood
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={moodChartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7bc47f" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#7bc47f" stopOpacity={0.08} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e9efeb" />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              dy={12}
            />

            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(value) => moodLabels[value]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              width={85}
            />

            <Tooltip
              formatter={(value) => [moodLabels[value], "Mood"]}
              labelStyle={{
                color: "#1f3f31",
                fontWeight: 600,
              }}
              contentStyle={{
                borderRadius: "14px",
                border: "1px solid #e2e8e4",
                backgroundColor: "#ffffff",
                color: "#1f3f31",
              }}
            />

            <Area
              type="monotone"
              dataKey="mood"
              stroke="#7bc47f"
              strokeWidth={3}
              fill="url(#moodGradient)"
              dot={{
                r: 5,
                fill: "#7bc47f",
                stroke: "#7bc47f",
              }}
              activeDot={{
                r: 7,
                fill: "#2b6a4f",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MoodChart;
