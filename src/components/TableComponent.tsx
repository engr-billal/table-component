import React, { useCallback, useMemo, useState } from "react";
import { IUserData } from "../App";
import debounce from "../utils/debounce";

const TableComponent: React.FC<{ data: IUserData[] }> = ({ data }) => {
  const [filterText, setFilterText] = useState("");
  const [sortKey, setSortKey] = useState<keyof IUserData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "age", label: "Age" },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const filteredData = useMemo(() => {
    if (!filterText) return data;

    return data.filter((row) => {
      return Object.values(row).some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase()));
    });
  }, [data, filterText]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage]);

  const handleSort = (key: keyof IUserData) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };


  const handleSearch = useCallback(
    debounce((text: string) => setFilterText(text), 1000),
    []
  );
  

  return (
    <>
      <input type="text" placeholder="search" onChange={(e) => handleSearch(e.target.value)} />

      <table border={1} style={{ marginTop: "20px" }}>
        <thead>
          {columns.map(({ key, label }) => {
            return (
              <th key={key} style={{cursor: 'pointer'}} onClick={() => handleSort(key as keyof IUserData)}>
                {label}
              </th>
            );
          })}
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>

        <span>
          {currentPage} of {totalPages}
        </span>

        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </>
  );
};

export default TableComponent;
