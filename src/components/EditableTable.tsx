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
    value: number
  ) => {
    let sum = 0;
    data.filter((row) => id !== row.id).map((row) => (sum += row.percentage));

    if (sum + value <= 100) {
      setError(false);
    } else {
      setError(true);
    }

    const newData = data.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    reorderRows(newData);
    setData(newData);
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
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          color="error"
          sx={{ marginBottom: "16px" }}
          onClick={handleReset}
        >
          Nullázás
        </Button>
        <Typography variant="h6" sx={{ marginBottom: "16px" }}>
          Fennmaradó: {100 - sum}%
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
              <TableCell>Százalék</TableCell>
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
                <TableCell>
                  <Typography>{row.mandates}</Typography>
                </TableCell>
                <TableCell>
                  <OutlinedInput
                    sx={{
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
                        !/^[0-9]+$/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    value={row.percentage}
                    endAdornment={
                      <InputAdornment position="end">%</InputAdornment>
                    }
                    error={error}
                    onChange={(e) =>
                      handleInputChange(
                        row.id,
                        "percentage",
                        parseInt(e.target.value)
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
