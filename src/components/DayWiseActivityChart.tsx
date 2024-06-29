import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { DataResponse } from "../services/api";

interface Props {
  data: DataResponse;
}

interface SeriesData {
  name: string;
  data: { x: string; y: number }[];
}

const DayWiseActivityChart: React.FC<Props> = ({ data }) => {
  const [options, setOptions] = useState<ApexCharts.ApexOptions>({});
  const [series, setSeries] = useState<SeriesData[]>([]);

  useEffect(() => {
    const activityTypes = data.data.AuthorWorklog.activityMeta.map(
      (meta) => meta.label
    );
    const colors = data.data.AuthorWorklog.activityMeta.map(
      (meta) => meta.fillColor
    );

    const seriesData: SeriesData[] = activityTypes.map((activityType) => ({
      name: activityType,
      data: [],
    }));

    data.data.AuthorWorklog.rows.forEach((row) => {
      row.dayWiseActivity.forEach((dayActivity) => {
        dayActivity.items.children.forEach((activity) => {
          const activityIndex = activityTypes.indexOf(activity.label);
          if (activityIndex !== -1) {
            const date = new Date(dayActivity.date).toISOString().split("T")[0];
            const existingDataIndex = seriesData[activityIndex].data.findIndex(
              (d) => d.x === date
            );

            if (existingDataIndex !== -1) {
              seriesData[activityIndex].data[existingDataIndex].y += parseInt(
                activity.count
              );
            } else {
              seriesData[activityIndex].data.push({
                x: date,
                y: parseInt(activity.count),
              });
            }
          }
        });
      });
    });

    const newOptions: ApexCharts.ApexOptions = {
      chart: {
        type: "line",
        height: 350,
        stacked: false,
        toolbar: {
          show: true,
        },
      },
      stroke: {
        width: [2, 2, 2, 2, 2, 2, 2],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Count",
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      colors: colors,
    };

    setOptions(newOptions);
    setSeries(seriesData);
  }, [data]);

  return <Chart options={options} series={series} type="line" height={350} />;
};

export default DayWiseActivityChart;
