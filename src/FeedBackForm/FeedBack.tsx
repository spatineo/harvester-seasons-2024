import React, { useState } from "react";
import { TextField, Button,Box, Typography } from "@mui/material";
import { useAppSelector, useRootDispatch } from "../store/hooks";
import { LanguageOptions, actions } from "../Lang/languageSlice";
import { languages } from "../Lang/languages";


function FeedbackForm() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const information = useAppSelector((state) => state.language);
  const dispatch = useRootDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
    setFeedback("");
  };

  const emailAddress = languages.email[information.lang as keyof LanguageOptions] as string
  return (
    <form
      action="feedback.php"
      method="post"
      target="_blank"
      onSubmit={handleSubmit}
      style={{ position: "relative", top: "1rem" }}
    >
       <Box><Typography variant="h6" sx={{ fontFamily: 'Lato'}}>{languages.feedBack[information.lang as keyof LanguageOptions]}</Typography></Box>
      <TextField
        label={emailAddress}
        variant="outlined"
        value={email}
        size="small"
        sx={{
          width: "100%",
          maxWidth: "500px",
          lineHeight: "1rem",
          paddingY: "0.2rem",
        }}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />
      <TextField
        id="feedback"
        label="Feedback"
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: "700px",
          lineHeight: "1rem",
          paddingY: "0.2rem",
        }}
        multiline
        rows={4}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <br />
      <br />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={email === "" || feedback === ""}
      >
        Submit
      </Button>
    </form>
  );
}

export default FeedbackForm;
