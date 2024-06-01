import {
  Box,
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

  let sum = 0;
  data.map((row) => (sum += row.percentage));

  const handleInputChange = (
    id: number,
    field: keyof PersonData,
    value: number
  ) => {
    let sum = 0;
    data.filter((row) => id !== row.id).map((row) => (sum += row.percentage));

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
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h6" sx={{ marginBottom: "16px" }}>
        Fennmaradó: {100 - sum}%
      </Typography>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "430px", width: "100%" }}
      >
        <Table style={{ tableLayout: "fixed" }}>
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
                <TableCell>
                  <Typography>{row.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{row.party}</Typography>
                </TableCell>
                <TableCell>
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
    </Box>
  );
};
