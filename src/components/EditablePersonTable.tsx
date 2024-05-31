import {
  InputAdornment,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

export interface PersonData {
  id: number;
  name: string;
  party: string;
  percentage: number;
  color: string;
}

interface EditableTableProps {
  data: PersonData[];
  setData: Function;
}

export const EditablePersonTable: React.FC<EditableTableProps> = ({
  data,
  setData,
}) => {
  const [error, setError] = useState(false);

  const handleInputChange = (
    id: number,
    field: keyof PersonData,
    value: number
  ) => {
    let sum = 0;
    data.filter((row) => id !== row.id).map((row) => (sum += row.percentage));
    console.log(sum + value);

    if (sum + value <= 100) {
      setError(false);
      const newData = data.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      );
      reorderRows(newData);
      setData(newData);
    } else {
      setError(true);
    }
  };

  const reorderRows = (newData: PersonData[]) => {
    newData.sort((a, b) => b.percentage - a.percentage);
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "430px", width: "100%" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Jelölt</TableCell>
            <TableCell>Pártnév</TableCell>
            <TableCell>Százalék</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell sx={{ width: "33%" }}>
                <Typography>{row.name}</Typography>
              </TableCell>
              <TableCell sx={{ width: "33%" }}>
                <Typography>{row.party}</Typography>
              </TableCell>
              <TableCell sx={{ width: "33%" }}>
                <OutlinedInput
                  type="number"
                  placeholder={row.percentage.toString()}
                  endAdornment={
                    <InputAdornment position="end">%</InputAdornment>
                  }
                  error={error}
                  onChange={(e) =>
                    handleInputChange(
                      row.id,
                      "percentage",
                      Number(e.target.value)
                    )
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
