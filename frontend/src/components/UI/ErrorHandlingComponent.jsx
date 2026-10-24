import { useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const ErrorHandlingComponent = ({ message, onClose, severity = "error" }) => {
  const [open, setOpen] = useState(Boolean(message));

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    onClose?.();
  };

  if (!message) return null;

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={handleClose}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorHandlingComponent;
