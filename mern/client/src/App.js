import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { createTheme } from '@mui/material/styles';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

// allows to change global theme easily
const theme = createTheme({
  typography: {
    fontFamily: ["Raleway", "Arial"].join(","),
  },
  palette: {
    primary: {
      main: "#3A5382",
      dark: "#545454",
      contrastText: "#F9F6E5",
      settings: "#FFFFFF",
    },
    secondary: {
      main: "#3A5382",
    },
    background: {
      default: "#201F1F",
    },
    text: {
      primary: "#ffffff",
    }
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />

        <Router>
          <div>
          <Switch>
            <Route exact path="/" component={withRouter(Home)} />
            <Route exact path="/login" component={withRouter(Login)} />
            <Route exact path="/signup" component={withRouter(Signup)} />
            <Route exact path="/admin" component={withRouter(Admin)} />
          </Switch>
          </div>
          </Router>

    </MuiThemeProvider>
  );
};

export default App;