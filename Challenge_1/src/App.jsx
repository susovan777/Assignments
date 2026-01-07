import React, { useEffect, useState } from "react";
import "./app.css";
import Table from "./Components/Table";
import Pagination from "./Components/Pagination";

const App = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const BASE_URL =
    "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
  const BASE_URL1 = "https://dummyjson.com/todos";

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await fetch(BASE_URL1);
        const actualData = await response.json();
        setData(actualData.todos);
        console.log(actualData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchedData();
  }, []);

  return (
    <div>
      <Table data={currentItems} />
      <Pagination
        totalItems={data.length}
        itemPerPage={itemPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default App;
