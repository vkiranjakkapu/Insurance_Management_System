import { defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";

import revenueData from "./data.json";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
// defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

export default function AdminDashBoard() {
    return (
        <>
            <div className="bg-slate-50 shadow-sm dark:bg-slate-800 p-3 rounded-lg">
                <Line
                    data={{
                        labels: revenueData.map((data) => data.label),
                        datasets: [
                            {
                                label: "Revenue",
                                data: revenueData.map((data) => data.revenue),
                                backgroundColor: "#064FF0",
                                borderColor: "#064FF0",
                            },
                            {
                                label: "Cost",
                                data: revenueData.map((data) => data.cost),
                                backgroundColor: "#FF3030",
                                borderColor: "#FF3030",
                            },
                        ],
                    }}
                    options={{
                        elements: {
                            line: {
                                tension: 0.5,
                            },
                        },
                        plugins: {
                            title: {
                                text: "Monthly Revenue & Cost",
                            },
                        },
                    }}
                />
            </div>
        </>
    );
}
