import { useMemo, useState, useCallback } from "react";
import {debounce} from "lodash";

interface TableProps<T extends object> {
  data: T[];
}

const TableComponent = <T extends object>({ data }: TableProps<T>) => {
  const columns = useMemo(() => {
    if (data.length === 0) return [];

    return Object.keys(data[0]) as Array<keyof T>;
  }, [data]);

  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState("");

  const rowsPerPage = 4;

  const debouncedFilteredText = useCallback(
    debounce((text: string) =>  {
      setFilterText(text);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredData = useMemo(() => {
    if (!filterText) return data;

    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText, data]);
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortKey]! < b[sortKey]!) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (a[sortKey]! > b[sortKey]!) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage]);

  return (
    <>
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => debouncedFilteredText(e.target.value)}
      />
      <table border={1}>
        <thead>
          {columns.map((column, index) => {
            return (
              <th
                key={index}
                style={{ cursor: "pointer" }}
                onClick={() => handleSort(column)}
              >
                {column.toString()}
              </th>
            );
          })}
        </thead>

        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {columns.map((column, index) => {
                return <td key={index}>{String(row[column])}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span>
          {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TableComponent;
