import clsx from "clsx";
import { i18n } from "i18n";
import Breadcrumb from "view/shared/Breadcrumb";
import { Grid } from "@material-ui/core";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import Chart from "./chart";
import DoughnutChart from "./DoughnutChart";
import LineChart from "./LineChart";
import MixChartOne from "./MixChartOne";
import PolarChart from "./PolarChart";

import React, { Component } from "react";

import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { clearErrors } from "../../../../actions/errorActions";
import EditableTable from "components/EditableTable";
import { loadAllLogsForSpecificUser } from "../../../../actions/adminActions";
import { loadUser } from "../../../../actions/authActions";
import { deleteLog } from "../../../../actions/authActions";

import moment from "moment-timezone";
const styles = {};

class Dashboard extends Component {
  state = {};

  static propTypes = {
    clearErrors: PropTypes.func.isRequired,
    allLogs: PropTypes.array,
    loadAllLogsForSpecificUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    loadUser: PropTypes.func.isRequired,
    user: PropTypes.object,
    deleteLog: PropTypes.func.isRequired
  };
  componentDidMount() {
    // this.props.loadUser();
    if (this.props.user)
      this.props.loadAllLogsForSpecificUser(this.props.user._id);
  }

  componentDidUpdate(prevProps) {}
  toggle = () => {
    // Clear errors
    this.props.clearErrors();
  };

  /**
   * This callback function sends back the email of the user to be deleted
   * after the delete button is clicked on the mui datatable.
   */
  deleteLogCallback = logid => {
    this.props.deleteLog(this.props.user._id, logid);
  };

  onSubmit = e => {
    e.preventDefault();

    const { code } = this.state;

    const { email } = this.props;

    //clear errors
    this.toggle();
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <DashboardContent
          allLogs={this.props.allLogs}
          deleteLogCallback={this.deleteLogCallback}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  allLogs: state.admin.allLogs,
  user: state.auth.user
});
export default connect(mapStateToProps, {
  clearErrors,
  loadAllLogsForSpecificUser,
  loadUser,
  deleteLog
})(withStyles(styles)(Dashboard));

function DashboardContent(props) {
  const useStyles = makeStyles(theme => ({
    paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column"
    },
    fixedHeight: {
      height: 260
    },
    smallScreenFixedHeight: {
      height: 360
    }
  }));

  const classes = useStyles();
  // const fixedHeightPaper = props.isSmallScreen
  //   ? clsx(classes.paper, classes.fixedHeight)
  //   : clsx(classes.paper, classes.smallScreenFixedHeight);

  const columns = [
    {
      name: "id",
      label: "id",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Name",
      label: "Name",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Email",
      label: "Email",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Role",
      label: "Role",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Explanation",
      label: "Explanation",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Type",
      label: "Type",
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: "Date_logged",
      label: "Date_logged",
      options: {
        filter: true,
        sort: true
      }
    }
  ];
  const data = props.allLogs
    ? props.allLogs.map(log => {
        return [
          log._id,
          log.name,
          log.email,
          log.role,
          log.explanation,
          log.type,
          new Date(log.date_logged).toString()
        ];
      })
    : [];
  const options = {
    filter: true,
    responsive: "scrollMaxHeight",
    onRowsDelete: rowsDeleted => {
      for (var i = 0; i < rowsDeleted.data.length; ++i) {
        //send back to UserAdmin component the email of the user to be deleted.
        props.deleteLogCallback(data[rowsDeleted.data[i].index][0]);
        console.log(rowsDeleted.data[i].index);
        console.log(data[i]);
      }
    }
  };

  return (
    <>
      <Breadcrumb
        items={[[i18n("frame.menu"), "/"], [i18n("dashboard.menu")]]}
      />
      {/*page title */}
      <div>
        <Typography variant="h1" size="sm">
          {props.title}
        </Typography>
        {props.button && (
          <Button variant="contained" size="large" color="secondary">
            {props.button}
          </Button>
        )}
      </div>
      <Grid container spacing={props.isSmallScreen ? 1 : 3}>
        <Grid item xs={12} md={8} lg={8}>
          <Paper className={classes.paper}>
            <Chart data={{}} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={classes.paper}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              doughnut
            </Typography>
            <DoughnutChart />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4} lg={4}>
          <Paper className={classes.paper}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              line
            </Typography>
            <LineChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={classes.paper}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              mixone
            </Typography>
            <MixChartOne />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={classes.paper}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              polar
            </Typography>
            <PolarChart />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <EditableTable
            title="User Actions"
            options={options}
            data={data}
            columns={columns}
          />
        </Grid>
      </Grid>

      <p
        style={{
          width: "100%",
          textAlign: "center",
          color: "grey"
        }}
      >
        {i18n("dashboard.message")}
      </p>
    </>
  );
}
