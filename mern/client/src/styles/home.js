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
    borderColor: "white",
  },
  inputText: {
    color: "#f1f2eb",
  }, 
  resumeBox: {
    height: 100,
    border: "1px solid #f1f2eb",
    borderRadius: "100px",
    alignSelf: "center",
    paddingTop: 30,
    cursor: "pointer",
    '&:hover': {
        background: "#c4843c",
     },
     background: "#3a5381"
     
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
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 40,
  },
  name: {
    color: "#f1f2eb",
  },
});

export default homeStyle;
