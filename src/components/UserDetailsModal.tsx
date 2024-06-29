import React from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface UserDetailsModalProps {
  open: boolean;
  handleClose: () => void;
  row: {
    name: string;
    prOpen: number;
    prMerged: number;
    commits: number;
    totalActivities: number;
    activityRate: string;
    dayWiseActivity: {
      date: string;
      items: {
        children: {
          count: string;
          label: string;
          fillColor: string;
        }[];
      };
    }[];
  };
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  handleClose,
  row,
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 700,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflowY: "auto",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h2"
          gutterBottom
        >
          User Activity Details
        </Typography>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Name:</strong> {row.name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Total Activities:</strong> {row.totalActivities}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>PR Open:</strong> {row.prOpen}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>PR Merged:</strong> {row.prMerged}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Commits:</strong> {row.commits}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Activity Rate:</strong> {row.activityRate}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <Typography variant="h6" gutterBottom>
          Day-wise Activities
        </Typography>
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {row.dayWiseActivity.map((day, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={<strong>{day.date}</strong>}
                  secondary={
                    <Grid container spacing={1}>
                      {day.items.children.map((activity, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Typography variant="body2" color="textSecondary">
                            {activity.label}: {activity.count}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Modal>
  );
};

export default UserDetailsModal;
