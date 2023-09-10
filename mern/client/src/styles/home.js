const homeStyle = (theme) => ({
  home: {
    backgroundColor: theme.palette.background.default,
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  logo: {
    height: 40,
    paddingRight: 10,
  },
  secret: {
    maxWidth: "100%",
  },
  center: {
    width: "50%",
    margin: "0 auto",
  },
  section: {
    marginTop: theme.spacing(4),
  },
  search: {
    alignSelf: "center",
    display: "inline-block",
    paddingBottom: "3vh",
  },

  resumeBox: {
    height: 100,
    width: 300,
    border: "2px solid #f1f2eb",
    borderRadius: "2px",
    alignSelf: "center",
    paddingTop: 25,
    cursor: "pointer",
    '&:hover': {
      background: "#7393B3",
    },
    background: "ffffff00"

  },
  appBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flexDirection: "column",
    textAlign: "center",
    paddingRight: 40,
    paddingLeft: 60,
    paddingTop: "3vh",
    paddingBottom: 50,

  },
  name: {
    color: "#f1f2eb",
  },
  major: {
    color: "#f1f2eb",
  }
});

export default homeStyle;
