import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const PortfolioCalculationsList = ({ calculations, setData }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Models</TableCell>
            <TableCell>Companies</TableCell>
            <TableCell>Risk Weight</TableCell>
            <TableCell>ESG Weight</TableCell>
            <TableCell>Start</TableCell>
            <TableCell>End</TableCell>
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
                {calculation.map((model) => model.Calculation.model).join(", ")}
              </TableCell>
              <TableCell>
                {calculation[0].Calculation.symbol_names.join(", ")}
              </TableCell>
              <TableCell>{calculation[0].Calculation.risk_weight}%</TableCell>
              <TableCell>{calculation[0].Calculation.esg_weight}%</TableCell>
              <TableCell>{calculation[0].Calculation.start}</TableCell>
              <TableCell>{calculation[0].Calculation.end}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PortfolioCalculationsList;
