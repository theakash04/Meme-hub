import React from "react";

const Header: React.FC = () => {
  return (
    <div style={styles.div}>
      <h1 style={styles.title}>MEME-HUB</h1>
    </div>
  );
};

const styles = {
  div: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34",
    // width: "100%",
    marginTop: "0px",
  },
  title: {
    color: "#ffffff",
    width: "100%",
    height: "100%",
    paddingTop: "10px",
    paddingBottom: "10px",
    paddingLeft: "50px",
    paddingRight: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    margin: 0,
  },
};

export default Header;
