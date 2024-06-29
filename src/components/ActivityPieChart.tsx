import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { DataResponse } from "../services/api";

interface Props {
  data: DataResponse;
}

const ActivityPieChart: React.FC<Props> = ({ data }) => {
  const [options, setOptions] = useState<ApexCharts.ApexOptions>({});
  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    const activityMeta = data.data.AuthorWorklog.activityMeta;
    const activityTypes = activityMeta.map((meta) => meta.label);
    const colors = activityMeta.map((meta) => meta.fillColor);

    const totalActivities = activityTypes.map((activityType) => {
      return data.data.AuthorWorklog.rows.reduce((sum, row) => {
        const activity = row.totalActivity.find(
          (act) => act.name === activityType
        );
        return sum + (activity ? parseInt(activity.value) : 0);
      }, 0);
    });

    const newOptions: ApexCharts.ApexOptions = {
      chart: {
        type: "pie",
      },
      labels: activityTypes,
      colors: colors,
      legend: {
        position: "bottom",
      },
      title: {
        text: "Activity Distribution",
        align: "center",
      },
    };

    setOptions(newOptions);
    setSeries(totalActivities);
  }, [data]);

  return <Chart options={options} series={series} type="pie" height={350} />;
};

export default ActivityPieChart;
