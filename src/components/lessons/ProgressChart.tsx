interface ProgressChartProps {
  percentage: number;
}

export default function ProgressChart({ percentage }: ProgressChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Progresso Total
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
          ></div>
        </div>
      </div>
    </div>
  );
} 