import { useCallback, useMemo, useState } from "react";
import { IUserData } from "../App";
import debounse from "lodash/debounce";

const TableComponent: React.FC<{ data: IUserData[]}> = ({ data }) => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "email", label: "Email" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");
  const [sortKey, setSortKey] = useState<keyof IUserData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const rowsPerPage = 4;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleSort = (key: keyof IUserData) => {
    if (key == sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredData = useMemo(() => {
    if (!filterText) return data;

    return data.filter((row) => {
      return Object.values(row).some((value) => value.toString().toLowerCase().includes(filterText.toLowerCase()));
    });
  }, [filterText, data]);

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

  const debouncedSetFilterText = useCallback(
    debounse((text: string) => setFilterText(text), 500),
    []
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => {
          debouncedSetFilterText(e.target.value);
        }}
      />
      <table border={1}>
        <thead>
          {columns.map(({ key, label }) => (
            <th key={key} style={{ cursor: "pointer" }} onClick={() => handleSort(key as keyof IUserData)}>
              {label} {sortKey === key ? (sortOrder === "asc" ? "+" : "-") : ""}
            </th>
          ))}
        </thead>

        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.age}</td>
              <td>{row.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>

        <span>
          {currentPage} of {Math.ceil(data.length / rowsPerPage)}
        </span>

        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
