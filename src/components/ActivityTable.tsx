import React, { useMemo, useState } from "react";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { DataResponse } from "../services/api";
import { IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";
import UserDetailsModal from "./UserDetailsModal";

interface Props {
  data: DataResponse;
}

const ActivityTable: React.FC<Props> = ({ data }) => {
  const rows = useMemo(() => {
    return data.data.AuthorWorklog.rows.map((row, index) => {
      const totalActivities = row.totalActivity.reduce((sum, activity) => {
        return sum + parseInt(activity.value, 10);
      }, 0);

      const activityRate = (
        row?.dayWiseActivity?.length > 0
          ? totalActivities / row.dayWiseActivity.length
          : 0
      ).toFixed(2);

      const prOpen = +(
        row.totalActivity.find((activity) => activity.name === "PR Open")
          ?.value || 0
      );
      const prMerged = +(
        row.totalActivity.find((activity) => activity.name === "PR Merged")
          ?.value || 0
      );
      const commits = +(
        row.totalActivity.find((activity) => activity.name === "Commits")
          ?.value || 0
      );

      const calculatePercentage = (value: number) =>
        ((value / totalActivities) * 100).toFixed(2);

      return {
        id: index,
        name: row.name,
        prOpen,
        prOpenPercentage: calculatePercentage(prOpen),
        prMerged,
        prMergedPercentage: calculatePercentage(prMerged),
        commits,
        commitsPercentage: calculatePercentage(commits),
        totalActivities,
        activityRate,
        dayWiseActivity: row.dayWiseActivity,
      };
    });
  }, [data]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<(typeof rows)[0] | null>(null);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 225, type: "string" },
    { field: "prOpen", headerName: "PR Open", width: 110, type: "number" },
    {
      field: "prOpenPercentage",
      headerName: "PR Open %",
      width: 110,
      type: "number",
    },
    { field: "prMerged", headerName: "PR Merged", width: 110, type: "number" },
    {
      field: "prMergedPercentage",
      headerName: "PR Merged %",
      width: 110,
      type: "number",
    },
    { field: "commits", headerName: "Commits", width: 110, type: "number" },
    {
      field: "commitsPercentage",
      headerName: "Commits %",
      width: 110,
      type: "number",
    },
    {
      field: "totalActivities",
      headerName: "Total Activities",
      width: 150,
      type: "number",
      renderCell: (params) => (
        <span className="font-bold text-blue-600">{params.value}</span>
      ),
    },
    {
      field: "activityRate",
      headerName: "Activity Rate per Day",
      width: 150,
      type: "number",
      renderCell: (params) => (
        <span className="font-bold text-green-600">{params.value}</span>
      ),
    },
    {
      field: "userActivityDetails",
      headerName: "",
      width: 60,
      type: "number",
      renderCell: (params) => {
        return (
          <div className="w-4 h-4 rounded-full">
            <IconButton
              color="primary"
              onClick={() => {
                setModalOpen(true);
                setSelectedRow(params.row);
              }}
            >
              <Info />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="bg-white p-4 rounded-lg mb-4">
        {selectedRow && (
          <UserDetailsModal
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
            row={selectedRow}
          />
        )}
        <h3 className="text-lg font-semibold mb-4">
          Overall Activity Details{" "}
          <span className="text-gray-500 mb-4 text-xs">
            (Click on the "i" icon to see details)
          </span>
        </h3>
        <div style={{ height: 500, width: "100%" }}>
          <DataGridPro
            rows={rows}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            pinnedColumns={{
              left: ["name"],
              right: ["userActivityDetails"],
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ActivityTable;
