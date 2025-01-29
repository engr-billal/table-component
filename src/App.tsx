import React from "react";
import TableComponent from "./components/Table";


export interface IUserData {
  id: number;
  name: string;
  age: number;
  email: string;
}

const data: IUserData[] = [
  { id: 1, name: "Alice Johnson", age: 25, email: "alice@example.com" },
  { id: 2, name: "Bob Smith", age: 30, email: "bob@example.com" },
  { id: 3, name: "Charlie Brown", age: 35, email: "charlie@example.com" },
  { id: 4, name: "Diana Prince", age: 28, email: "diana@example.com" },
  { id: 5, name: "Evan Peters", age: 22, email: "evan@example.com" },
  { id: 6, name: "Fiona Adams", age: 27, email: "fiona@example.com" },
  { id: 7, name: "George White", age: 31, email: "george@example.com" },
  { id: 8, name: "Hannah Lee", age: 29, email: "hannah@example.com" },
  { id: 9, name: "Ian Scott", age: 33, email: "ian@example.com" },
  { id: 10, name: "Jenny Kim", age: 26, email: "jenny@example.com" },
];

const App: React.FC = () => {
  return (
    <div>
      <h1>User Table</h1>
      <TableComponent data={data} />
    </div>
  );
};

export default App;
