import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import views from "../utils/views";

const Controllers = ({ view, setView }) => {
  return (
    <Tabs
      value={view}
      onChange={(_, value) => setView(value)}
      variant="fullWidth"
      indicatorColor="secondary"
      sx={{
        backgroundColor: "primary.light",
        boxShadow: "1px 1px 3px #607d8b",
      }}
      centered
    >
      {views.map((v) => (
        <Tab
          key={v.value}
          label={v.label}
          value={v.value}
          sx={{
            "&.MuiButtonBase-root.Mui-selected": {
              color: "white",
            },
          }}
        />
      ))}
    </Tabs>
  );
};

export default Controllers;
