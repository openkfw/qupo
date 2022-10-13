import { useEffect, useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import store from "store-js";

const SelectModels = ({ defaultModels }) => {
  const [selectedModels, setSelectedModels] = useState(defaultModels);
  const models = [
    {
      key: "osqp",
      name: "OSQP",
      kind: "classic",
      provider: "University of Oxford",
      description:
        "The Operator Splitting Quadratic Program (OSQP) solver is an operator for solving convex quadratic programs. Quadratic Programming (QP) is used to optimize mathematical problems that involve quadratic objective functions.",
    },
    {
      key: "qio",
      name: "QIO",
      kind: "quantum inspired",
      provider: "Microsoft Azure Quantum",
      description:
        "Quantum-Inspired Optimization algorithms simulate the effects of quantum computing on classical computers, providing a speedup over classical solutions.",
    },
    {
      key: "pypo",
      name: "PyPo",
      kind: "classic",
      provider: "PyPortfolioOpt",
      description:
        "PyPortfolioOpt is a library that provides algorithms to implement portfolio optimization methods, like classical efficient frontier techniques.",
    },
    {
      key: "qiskit",
      name: "Qiskit",
      kind: "quantum",
      provider: "IBM",
      description:
        "Qiskit is an open source library that provides tools to work with quantum computers. It includes a set of quantum gates and pre-built circuits.",
    },
    {
      key: "ionq",
      name: "IonQ",
      kind: "quantum",
      provider: "IonQ with Microsoft Azure",
      description:
        "IonQ's cloud-based implementation of performing calculations on an idealized quantum computer simulator.",
    },
  ];

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
      <FormControlLabel
        key={model.name}
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
    );
  });
};

export default SelectModels;
