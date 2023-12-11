import React, { useEffect } from "react";
import axios from "axios";

function Home() {
  useEffect(() => {
    axios
      .get("http://localhost:5555/books")
      .then((response) => console.log({ response }));
  }, []);

  return <div className="bg-red-400">Home</div>;
}

export default Home;
