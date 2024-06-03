import {
  Box,
  Button,
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
  icon: string[];
}

interface EditableTableProps {
  data: PartyData[];
  setData: Function;
  fullscreen?: boolean;
  handleReset: () => void;
}

export const EditableTable: React.FC<EditableTableProps> = ({
  data,
  setData,
  fullscreen,
  handleReset,
}) => {
  const [error, setError] = useState(false);
  let sum = 0;
  data.map((row) => (sum += row.percentage));

  const handleInputChange = (
    id: number,
    field: keyof PartyData,
    value: string
  ) => {
    const regex = /^\d*\.?\d{0,1}$/;
    if (regex.test(value)) {
      let valueF = parseFloat(value);
      let sum = 0;
      data.filter((row) => id !== row.id).map((row) => (sum += row.percentage));

      if (sum + valueF <= 100) {
        setError(false);
      } else {
        setError(true);
      }

      const newData = data.map((row) =>
        row.id === id ? { ...row, [field]: valueF } : row
      );
      reorderRows(newData);
      setData(newData);
    }
  };

  const reorderRows = (newData: PartyData[]) => {
    newData.sort((a, b) => b.percentage - a.percentage);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "95%",
          marginBottom: "16px",
        }}
      >
        <Button variant="contained" color="error" sx={{}} onClick={handleReset}>
          Nullázás
        </Button>
        <Typography variant="h6">
          Fennmaradó: {(100.0 - sum).toFixed(1)}%
        </Typography>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: fullscreen ? "100%" : "430px", width: "100%" }}
      >
        <Table style={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Pártnév</TableCell>
              <TableCell>Mandátum</TableCell>
              <TableCell width={"20%"}>Százalék</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    {row.icon?.map((icon, index) => (
                      <img
                        key={index}
                        src={icon}
                        alt="icon"
                        style={{ width: "60px" }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>{row.name}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{row.mandates}</Typography>
                </TableCell>
                <TableCell>
                  <OutlinedInput
                    sx={{
                      paddingRight: "4px",
                      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                        {
                          display: "none",
                        },
                      "& input[type=number]": {
                        MozAppearance: "textfield",
                      },
                    }}
                    type="number"
                    onKeyDown={(e) => {
                      if (
                        !/^[0-9\.,]+$/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder={row.percentage.toString()}
                    endAdornment={
                      <InputAdornment position="end">%</InputAdornment>
                    }
                    error={error}
                    onChange={(e) =>
                      handleInputChange(row.id, "percentage", e.target.value)
                    }
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      const regex = /^\d*\.?\d{0,1}$/;
                      if (!regex.test(input.value)) {
                        input.value = input.value.slice(0, -1);
                      }
                    }}
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
