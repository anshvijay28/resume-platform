const adminStyle = (theme) => ({
    appBar: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logo: {
        height: 40,
        paddingRight: 10,
      },
    container: {
      flexDirection: "column",
      textAlign: "center",
    },
    buttons: {
      display: "flex",
      flexDirection: "column",
      marginTop: 50,
      marginLeft: "auto",
      marginRight: "auto",
      width: 500,
      minHeight: 200,
      justifyContent: "space-between",
      alignItems: "center",


    },
    rowDisplay: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",


    }
  });
  
  export default adminStyle;
  