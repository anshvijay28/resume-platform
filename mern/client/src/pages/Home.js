// Material UI components
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import homeStyles from "../styles/home";
import { APP_URL } from "../static/constants";
import logo from "../static/white-logo.png";
import Modal from "@material-ui/core/Modal";
import Grid from "@material-ui/core/Grid";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resumes: [],
      search: "",
      loading: false,
      currentResume: {},
      open: false,
    };
  }

  componentDidMount() {
    console.log("checking user");
    const user = localStorage.getItem("user");
    if (user === null || user === undefined) {
      console.log("no user");
      this.props.history.push("/login");
    } else {
      console.log("user found");
      console.log(JSON.parse(user));
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleLogout = () => {
    localStorage.clear();
    this.props.history.push("/login");
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    let userData = localStorage.getItem("user");
    let user = JSON.parse(userData);
    fetch(`${APP_URL}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accesstoken: user.accessToken,
      },
      body: JSON.stringify({
        search: this.state.search,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          this.setState({ resumes: data.results, loading: false });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.history.push("/login");
      });
  };

  getSrcData = (data) => {
    return "data:application/pdf;base64," + data;
  };

  getURLFromBlobData = (data) => {
    let blob = new Blob([data], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  };

  render() {
    const { classes } = this.props;
    console.log(this.state.resumes);
    if (this.state.loading) {
      return (
        <Backdrop open={this.state.loading} className={classes.backdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }
    return (
      <div>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <img src={logo} alt="logo" className={classes.logo} />
            <Typography variant="h4" className={classes.title}>
              Resume Platform
            </Typography>
            <Button
              style={{ marginLeft: 50 }}
              color="inherit"
              className={classes.logout}
              onClick={this.handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.container}>
          <TextField
            variant="outlined"
            margin="normal"
            name="search"
            label="search"
            type="search"
            id="search"
            className={classes.search}
            value={this.state.search}
            onChange={this.handleChange}
            onKeyDown={(e) => (e.key === "Enter" ? this.handleSubmit(e) : null)}
          />
          <Grid container>
            {this.state.resumes.map((resume) => (
              <Grid item xs={12} sm={6} md={6} lg={3} key={resume._id}>
                <div style={{ height: 150, paddingTop: 25 }}>
                  <div
                    className={classes.resumeBox}
                    onClick={() =>
                      this.setState({ open: true, currentResume: resume })
                    }
                  >
                    <Typography variant="h5">
                      {resume.name.first + " " + resume.name.last}
                    </Typography>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>

        <Modal open={this.state.open}>
          <div style={{"height": 750}}>
            
            <iframe
              src={this.getSrcData(this.state.currentResume.fileData)}
              width="100%"
              height="100%"
              title="pdf"
            ></iframe>
            <Button onClick={() => this.setState({ open: false })} style={{"width": "100%", "backgroundColor": "lightblue"}}>
              Close
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withStyles(homeStyles)(Home);
