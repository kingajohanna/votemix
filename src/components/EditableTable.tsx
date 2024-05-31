import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

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
  const handleInputChange = (
    id: number,
    field: keyof PartyData,
    value: string | number
  ) => {
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
    <TableContainer component={Paper} sx={{ maxWidth: "430px", width: "100%" }}>
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
                <TextField
                  type="number"
                  placeholder={row.percentage.toString()}
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
