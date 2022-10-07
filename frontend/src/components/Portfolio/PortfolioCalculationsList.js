import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";

import { formatDate, shortenString } from "../../utils/helpers";

const PortfolioCalculationsList = ({ calculations, setData }) => {
  return (
    <Paper sx={{ mt: 2, ml: 1, width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Models</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Companies</TableCell>
              <TableCell sx={{ fontWeight: "bold", lineHeight: 1.3 }}>
                Risk Weight
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", lineHeight: 1.3 }}>
                ESG Weight
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculations.map((calculation, index) => (
              <TableRow
                key={index}
                onClick={() => setData(calculation)}
                sx={{ cursor: "pointer" }}
                hover
              >
                <TableCell>
                  {calculation
                    .map((model) => model.Calculation.model)
                    .join(", ")}
                </TableCell>
                <Tooltip title={calculation[0].Calculation.symbols.join(", ")}>
                  <TableCell>
                    {shortenString(
                      calculation[0].Calculation.symbol_names.join(", "),
                      100
                    )}
                  </TableCell>
                </Tooltip>
                <TableCell>{calculation[0].Calculation.risk_weight}%</TableCell>
                <TableCell>{calculation[0].Calculation.esg_weight}%</TableCell>
                <TableCell>
                  {formatDate(calculation[0].Calculation.start)}
                </TableCell>
                <TableCell>
                  {formatDate(calculation[0].Calculation.end)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PortfolioCalculationsList;
