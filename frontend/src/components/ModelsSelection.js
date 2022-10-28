import { Fragment, useEffect, useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import models from "../utils/models.json";

import store from "store-js";

const TooltipTitle = ({ model }) => {
  return (
    <Fragment>
      <Stack spacing={0.5}>
        <Grid>
          <b>Type: </b>
          {model.kind}
          <br />
        </Grid>
        <Grid>
          <b>Provider: </b>
          {model.provider}
          <br />
        </Grid>
        <Grid>{model.description}</Grid>
      </Stack>
    </Fragment>
  );
};

const ModelsSelection = ({ defaultModels }) => {
  const [selectedModels, setSelectedModels] = useState(defaultModels);

  useEffect(() => {
    store.set("selected_models", selectedModels);
  });

  const onSelectModel = (event, model, selectedModels) => {
    let selectedModelsNew = [model];

    if (selectedModels.length) {
      if (event.target.checked) selectedModelsNew = [...selectedModels, model];
      else selectedModelsNew = selectedModels.filter((m) => m !== model);
    }

    store.set("selected_models", selectedModelsNew);
    setSelectedModels(selectedModelsNew);
  };

  return models.map((model) => {
    const checked = selectedModels.includes(model.key);

    return (
      <Tooltip title={<TooltipTitle model={model} />} key={model.name} arrow>
        <FormControlLabel
          label={model.name}
          control={
            <Checkbox
              size="small"
              checked={checked}
              onChange={(event) =>
                onSelectModel(event, model.key, selectedModels)
              }
            />
          }
        />
      </Tooltip>
    );
  });
};

export default ModelsSelection;
