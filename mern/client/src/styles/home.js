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
    paddingBottom: 25,
    paddingTop: 25,
  },
  resumeBox: {
    height: 100,
    border: "1px solid black",
    alignSelf: "center",
    paddingTop: 30,
    cursor: "pointer",
    '&:hover': {
        background: "#9be396",
     },
     background: "#dbedda"
     
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
  },
});

export default homeStyle;
