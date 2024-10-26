"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CreateExpense from "./CreateExpense";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses function
  const fetchExpenses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/expense/all");
      setExpenses(response.data);
    } catch (error) {
      console.error("There was an error", error);
    }
  };

  // Initial load of expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Unpaid" ? "Paid" : "Unpaid";
    try {
      // Update status in the backend
      await axios.put(`http://localhost:8080/api/expense/${id}/status`, { status: newStatus });
      
      // Refresh the expenses list after update
      fetchExpenses();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  return (
    <div>
      <CreateExpense onExpenseCreated={fetchExpenses} />
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Date</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Description</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {expense.title}
                  </TableCell>
                  <TableCell align="right">{expense.amount}</TableCell>
                  <TableCell align="right">{expense.date}</TableCell>
                  <TableCell align="right">{expense.category}</TableCell>
                  <TableCell align="right">{expense.description}</TableCell>
                  <TableCell
  align="right"
  onClick={() => toggleStatus(expense.id, expense.status || "Unpaid")}
  style={{
    cursor: "pointer",
    color: expense.status === "Paid" ? "green" : "red",
    fontWeight: "bold",
  }}
>
  {expense.status || "Unpaid"}
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ExpenseList;
