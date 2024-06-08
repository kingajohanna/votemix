import { Box, Button } from "@mui/material";

export const Buttons = ({
  next,
  saved,
  onsave,
  nextDisabled,
}: {
  next: any;
  saved: boolean;
  onsave: any;
  nextDisabled?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        paddingTop: "16px",
        paddingBottom: "16px",
        flexDirection: "row",
        width: "95%",
        justifyContent: "space-between",
      }}
    >
      <Button
        variant="contained"
        sx={{
          backgroundColor: saved ? "green" : "primary",
          "&:hover": {
            backgroundColor: saved ? "green" : "primary",
          },
        }}
        onClick={onsave}
      >
        {saved ? "Mentve" : "Mentés"}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={next}
        disabled={nextDisabled}
      >
        Tovább
      </Button>
    </Box>
  );
};
