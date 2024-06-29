import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { DataResponse } from "../services/api";

interface Props {
  data: DataResponse;
}

const ActivityChart: React.FC<Props> = ({ data }) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState<
    { name: string; data: number[]; color: string }[]
  >([]);

  useEffect(() => {
    const activityTypes = data.data.AuthorWorklog.activityMeta.map(
      (meta) => meta.label
    );
    const colors = data.data.AuthorWorklog.activityMeta.map(
      (meta) => meta.fillColor
    );

    const newSeries = activityTypes.map((activityType, index) => ({
      name: activityType,
      data: data.data.AuthorWorklog.rows.map((row) => {
        const activity = row.totalActivity.find(
          (activity) => activity.name === activityType
        );
        return activity ? parseInt(activity.value, 10) : 0;
      }),
      color: colors[index],
    }));

    const newOptions = {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: data.data.AuthorWorklog.rows.map((row) => row.name),
        labels: {
          style: {
            colors: "#9AA0AC",
          },
        },
      },
      yaxis: {
        title: {
          text: "Count",
          style: {
            color: "#9AA0AC",
          },
        },
        labels: {
          style: {
            colors: "#9AA0AC",
          },
        },
      },
      fill: {
        opacity: 1,
        colors: colors,
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return `${val} activities`;
          },
        },
      },
      title: {
        text: "Developer Activity Overview",
        align: "left",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "18px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
      colors: colors,
    };

    setOptions(newOptions);
    setSeries(newSeries);
  }, [data]);

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default ActivityChart;
