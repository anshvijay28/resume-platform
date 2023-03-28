// Material UI components
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { APP_URL } from "../static/constants";
import logo from "../static/white-logo.png";
import adminStyle from "../styles/admin";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resume: null,
      pdfFileURL: null,
      loading: false,
      jsonFileURL: null,
      pdfData: null,
    };
  }

  handleBack = () => {
    this.props.history.push("/");
  };

  handleUploadJSON = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");

    fileReader.onload = (e) => {
      let resume = JSON.parse(e.target.result);
      this.setState({ resume: resume.resumes[0].data });
    };

    const fileReader2 = new FileReader();
    fileReader2.readAsDataURL(event.target.files[0]);
    fileReader2.onload = (e) => {
      this.setState({ jsonFileURL: e.target.result });
    };
  };

  addQueryParams = (url, params) => {
    var str = "";
    for (const [key, value] of Object.entries(params)) {
      str += key + "=" + value + "&";
    }
    str = str.substring(0, str.length - 1);
    url += "?" + str;
    return url;
  };


  handleUploadPDF = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(event.target.files[0]);
    fileReader.onload = (e) => {
      console.log(typeof e.target.result);
      this.setState({ pdfData: e.target.result });
    };

    const fileReader2 = new FileReader();
    fileReader2.readAsDataURL(event.target.files[0]);
    fileReader2.onload = (e) => {
      this.setState({ pdfFileURL: e.target.result });
    };
  };

  saveJSON = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    let userData = localStorage.getItem("user");
    let user = JSON.parse(userData);

    fetch(`${APP_URL}/resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accesstoken: user.accessToken,
      },
      body: JSON.stringify({
        resume: this.state.resume,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          this.savepdfData(user);
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.history.push("/login");
      });
  };

  savepdfData = (user) => {
    let pdfURL = this.addQueryParams(`${APP_URL}/file`, {
      first: this.state.resume.name.first,
      last: this.state.resume.name.last
    });
    fetch(pdfURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/pdf",
        accesstoken: user.accessToken,
      },
      body: this.state.pdfData,
    })
      .then(() => this.setState({ loading: false }))
      .catch((err) => {
        this.setState({ loading: false });
        this.props.history.push("/login");
      });
  };

  render() {
    const { classes } = this.props;

    if (this.state.loading) {
      return (
        <Backdrop open={this.state.loading} className={classes.backdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }
    return (
      <div className={classes.container}>
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
              onClick={this.handleBack}
            >
              Back
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.buttons}>
          <input
            style={{ display: "none" }}
            id="json-input"
            type="file"
            onChange={this.handleUploadJSON}
          />
          <label htmlFor="json-input">
            <Button variant="contained" component="span">
              Upload JSON
            </Button>
          </label>
          <input
            style={{ display: "none" }}
            id="pdf-input"
            type="file"
            onChange={this.handleUploadPDF}
          />
          <label htmlFor="pdf-input">
            <Button variant="contained" component="span">
              Upload PDF
            </Button>
          </label>

          <Button
            onClick={this.saveJSON}
            disabled={this.state.resume == null || this.state.pdfData == null}
          >
            Submit
          </Button>

          <div className={classes.rowDisplay}>
            {this.state.jsonFileURL !== null ? (
              <iframe
                title="JSON Viewer"
                src={this.state.jsonFileURL}
                style={{ width: 600, height: 500 }}
              ></iframe>
            ) : (
              <Typography>Please upload a JSON</Typography>
            )}

            {this.state.pdfFileURL !== null ? (
              <iframe
                title="PDF Viewer"
                src={this.state.pdfFileURL}
                style={{ width: 600, height: 500 }}
              ></iframe>
            ) : (
              <Typography style={{ marginLeft: 50 }}>
                Please upload a PDF
              </Typography>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(adminStyle)(Admin);
