import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  tabs: {
    "&.MuiButtonBase-root.Mui-selected": {
      color: theme.palette.common.white,
    },
    backgroundColor: theme.palette.primary.light,
  },
}));

const Controllers = ({ view, setView }) => {
  const classes = useStyles();

  return (
    <Tabs
      value={view}
      onChange={(_, value) => setView(value)}
      variant="fullWidth"
      indicatorColor="secondary"
      className={classes.tabs}
      style={{ boxShadow: "1px 1px 3px #607d8b" }}
      centered
    >
      <Tab label="Indices" value="index" className={classes.tabs} />
      <Tab label="Countries" value="country" className={classes.tabs} />
      <Tab label="Industries" value="industry" className={classes.tabs} />
    </Tabs>
  );
};

export default Controllers;
