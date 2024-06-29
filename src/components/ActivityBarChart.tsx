import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { DataResponse } from "../services/api";

interface Props {
  data: DataResponse;
}

const ActivityBarChart: React.FC<Props> = ({ data }) => {
  const [options, setOptions] = useState<ApexCharts.ApexOptions>({});
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);

  useEffect(() => {
    const activityMeta = data.data.AuthorWorklog.activityMeta;
    const activityTypes = activityMeta.map((meta) => meta.label);
    const colors = activityMeta.map((meta) => meta.fillColor);

    const seriesData: { name: string; data: number[] }[] = activityTypes.map(
      (activityType) => ({
        name: activityType,
        data: data.data.AuthorWorklog.rows.map((row) => {
          const activity = row.totalActivity.find(
            (act) => act.name === activityType
          );
          return activity ? parseInt(activity.value) : 0;
        }),
      })
    );

    const newOptions: ApexCharts.ApexOptions = {
      chart: {
        type: "bar",
        stacked: false,
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "100%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: data.data.AuthorWorklog.rows.map((row) =>
          data.data.AuthorWorklog.rows?.length > 1
            ? row?.name?.length > 20
              ? row.name.substring(0, 20) + "..."
              : row.name
            : row.name
        ),
      },
      yaxis: {
        title: {
          text: "Count",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} activities`,
        },
      },
      title: {
        text: "Activity Count per User",
        align: "center",
      },
      colors: colors,
    };

    setOptions(newOptions);
    setSeries(seriesData);
  }, [data]);

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default ActivityBarChart;
