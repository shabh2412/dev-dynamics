import { useEffect, useMemo, useState } from "react";
import Container from "./components/common/Container";
import { DataResponse, fetchData } from "./services/api";
import ActivityChart from "./components/ActivityChart";
import ActivityTable from "./components/ActivityTable";
import AggregationCard from "./components/AggregationCard";
import FilterBar from "./components/FilterBar";
import DayWiseActivityChart from "./components/DayWiseActivityChart";
import ActivityPieChart from "./components/ActivityPieChart";
import ActivityBarChart from "./components/ActivityBarChart";
import MuiXLicense from "./License/MUILicense";

function App() {
  const [data, setData] = useState<DataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    dateRange: { start: "", end: "" },
    activityType: "",
    user: "",
  });

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
    } catch (error) {
      if (typeof error === "string") {
        setError(error);
      } else {
        console.error({ error });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredData: DataResponse | null = useMemo(() => {
    if (!data) return data;

    const filteredRows = JSON.parse(
      JSON.stringify(
        data.data.AuthorWorklog.rows.filter((row) => {
          const matchesUser = !filters.user || row.name === filters.user;

          const matchesActivity = filters.activityType
            ? row.totalActivity.some((activity) => {
                const match =
                  activity.name === filters.activityType &&
                  parseInt(activity.value) > 0;
                return match;
              })
            : true;
          return matchesUser && matchesActivity;
        })
      )
    ) as DataResponse["data"]["AuthorWorklog"]["rows"];

    for (let i = 0; i < filteredRows.length; i++) {
      const row = filteredRows[i];
      if (filters.dateRange.start || filters.dateRange.end) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        row.dayWiseActivity = row.dayWiseActivity.filter((day) => {
          const dayDate = new Date(day.date);
          if (filters.dateRange.start && filters.dateRange.end) {
            return dayDate >= startDate && dayDate <= endDate;
          } else if (filters.dateRange.start) {
            return dayDate >= startDate;
          } else if (filters.dateRange.end) {
            return dayDate <= endDate;
          }
        });
      }
    }

    return {
      ...data,
      data: {
        ...data.data,
        AuthorWorklog: {
          ...data.data.AuthorWorklog,
          rows: filteredRows,
        },
      },
    } as DataResponse;
  }, [data, filters]);

  const totalActivities = useMemo(() => {
    if (!filteredData) return [];

    return filteredData.data.AuthorWorklog.activityMeta.map((meta) => {
      const total = filteredData.data.AuthorWorklog.rows.reduce((sum, row) => {
        const activity = row.totalActivity.find(
          (activity) => activity.name === meta.label
        );
        return sum + (activity ? parseInt(activity.value, 10) : 0);
      }, 0);
      return {
        label: meta.label,
        total,
        fillColor: meta.fillColor,
      };
    });
  }, [filteredData]);

  return (
    <>
      <MuiXLicense />
      <Container className="min-h-[100vh] p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">
          Developer Activity Dashboard
        </h1>
        {loading && (
          <div className="flex items-center justify-center min-h-[100vh]">
            <p>Loading...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center min-h-[100vh] flex-col">
            <p>{error}</p>
            <button
              onClick={getData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Retry
            </button>
          </div>
        )}
        {data && filteredData && (
          <>
            <FilterBar filters={filters} setFilters={setFilters} data={data} />
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {totalActivities.map((activity) => (
                <AggregationCard
                  key={activity.label}
                  title={`Total ${activity.label}`}
                  value={activity.total}
                  description={`Total ${activity.label}`}
                  color={activity.fillColor}
                />
              ))}
            </div>
            <h2 className="text-xl font-semibold mb-4">Visualizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Container className="w-full bg-white p-4 border border-gray-300 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Activity Distribution
                </h3>
                <ActivityPieChart data={filteredData} />
              </Container>
              <Container className="w-full bg-white p-4 border border-gray-300 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Activity Count per User
                </h3>
                <ActivityBarChart data={filteredData} />
              </Container>
            </div>
            <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
              <Container className="w-full bg-white p-4 border border-gray-300 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Overall Activity</h3>
                <ActivityChart data={filteredData} />
              </Container>
              <Container className="w-full bg-white p-4 border border-gray-300 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Day-wise Activity
                </h3>
                <DayWiseActivityChart data={filteredData} />
              </Container>
            </div>
            <h2 className="text-xl font-semibold mb-4">Detailed Data</h2>
            <Container className="w-full rounded-lg shadow-md bg-white">
              <ActivityTable data={filteredData} />
            </Container>
          </>
        )}
      </Container>
    </>
  );
}

export default App;
