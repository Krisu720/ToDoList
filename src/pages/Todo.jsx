import React, { useEffect, useReducer, useState } from "react";
import {
  Box,
  Button,
  Container,
  createTheme,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const ACTIONS = {
  ADD_TODO: "add_todo",
  REMOVE_TODO: "remove_todo",
  CHECK_TODO: "check_todo",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TODO: {
      const data = new Date();
      const readableData =
        data.getDate() +
        "/" +
        (data.getMonth() + 1) +
        "/" +
        data.getFullYear() +
        "  " +
        data.getHours() +
        ":" +
        data.getMinutes() +
        ":" +
        data.getSeconds();
      if (action.payload.name !== "") {
        return [
          ...state,
          {
            id: state.length + 1,
            date: readableData,
            name: action.payload.name,
            status: false,
          },
        ];
      } else {
        return state;
      }
    }
    case ACTIONS.REMOVE_TODO: {
      let filtered = state.filter((item) => item.id !== action.payload.id);
      filtered = filtered.map((item, number) => {
        return {
          ...item,
          id: number + 1,
        };
      });
      return filtered;
    }
    case ACTIONS.CHECK_TODO: {
      const newState = state.map((obj) => {
        if (obj.id === action.payload.item.id) {
          return { ...obj, status: !obj.status };
        }

        return obj;
      });
      return newState;
    }
  }
};
const Todo = () => {
  function getLocal() {
    const localdata = localStorage.getItem("todo");
    return localdata ? JSON.parse(localdata) : [];
  }
  const [todos, dispatch] = useReducer(reducer, getLocal());

  const [pole, setPole] = useState("");

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.ADD_TODO, payload: { name: pole } });
    setPole("");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "100vh",
          bgcolor: "#424242",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="xs">
          <Paper sx={{ p: 5 }}>
            <form onSubmit={handleAdd}>
              <Stack spacing={2}>
                <Typography variant="h3">To Do:</Typography>
                <TextField
                  label="New Todo"
                  variant="filled"
                  value={pole}
                  onChange={(e) => setPole(e.target.value)}
                  autoComplete="off"
                />
                <Button variant="contained" color="error" onClick={handleAdd}>
                  Dodaj
                </Button>
                <List>
                  {todos.map((item) => (
                    <ListItem
                      sx={{ cursor: "pointer" }}
                      key={item.id}
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.CHECK_TODO,
                          payload: { item: item },
                        })
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography
                            sx={
                              item.status
                                ? {
                                    textDecoration: "line-through",
                                    color: "gray",
                                  }
                                : {}
                            }
                          >
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={
                              item.status
                                ? {
                                    textDecoration: "line-through",
                                    color: "gray",
                                  }
                                : { color: "gray" }
                            }
                          >
                            {item.date}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          color="error"
                          onClick={() =>
                            dispatch({
                              type: ACTIONS.REMOVE_TODO,
                              payload: { id: item.id },
                            })
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Todo;
