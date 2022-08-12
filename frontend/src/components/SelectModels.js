import { useEffect, useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import store from "store-js";

const SelectModels = ({ defaultModels }) => {
  const [selectedModels, setSelectedModels] = useState(defaultModels);
  const models = ["osqp", "qio", "pypo", "qiskit", "ionq"];

  useEffect(() => {
    store.set("selected_models", selectedModels);
  });

  const onSelectModel = (event, selectedModels) => {
    const model = event.target.name;
    let selectedModelsNew = [model];

    if (selectedModels.length) {
      if (event.target.checked) selectedModelsNew = [...selectedModels, model];
      else selectedModelsNew = selectedModels.filter((m) => m !== model);
    }

    store.set("selected_models", selectedModelsNew);
    setSelectedModels(selectedModelsNew);
  };

  return models.map((model) => {
    const checked = selectedModels.includes(model);

    return (
      <FormControlLabel
        key={model}
        label={model}
        control={
          <Checkbox
            size="small"
            name={model}
            onChange={(event) => onSelectModel(event, selectedModels)}
            checked={checked}
          />
        }
      />
    );
  });
};

export default SelectModels;
