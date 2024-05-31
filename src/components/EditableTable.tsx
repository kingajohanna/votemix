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

export interface PartyData {
  id: number;
  name: string;
  percentage: number;
  mandates: number;
  color: string;
}

interface EditableTableProps {
  data: PartyData[];
  setData: Function;
}

export const EditableTable: React.FC<EditableTableProps> = ({
  data,
  setData,
}) => {
  const [error, setError] = useState(false);
  let sum = 0;
  data.map((row) => (sum += row.percentage));

  const handleInputChange = (
    id: number,
    field: keyof PartyData,
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

  const reorderRows = (newData: PartyData[]) => {
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pártnév</TableCell>
              <TableCell>Mandátum</TableCell>
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
                  <Typography>{row.mandates}</Typography>
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
    </Box>
  );
};
