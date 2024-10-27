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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [message, setMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedExpense(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedExpense({ ...selectedExpense, [name]: value });
  };
  const handleEditSave = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/expense/${selectedExpense.id}`,
        selectedExpense
      );
      setMessage("Expense edited successfully");
      fetchExpenses();
      closeEditModal();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error editing expense", error);
    }
  };

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
      await axios.put(`http://localhost:8080/api/expense/${id}/status`, {
        status: newStatus,
      });

      // Refresh the expenses list after update
      fetchExpenses();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/expense/${id}`);
      setMessage("Expense deleted succesfully");
      fetchExpenses();
      setTimeout(() => setMessage(""), 3000); // Refresh list after deletion
    } catch (error) {
      console.error("Error deleting expense", error);
    }
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
  };

  return (
    <div>
      {message && (
        <div style={{ color: "green", marginBottom: "10px" }}>{message}</div>
      )}
      <CreateExpense
        onExpenseCreated={fetchExpenses}
        
      />
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
                <TableCell align="right">Actions</TableCell>
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
                  <TableCell className="text-3xl" align="right">
                    {expense.description}
                  </TableCell>
                  <TableCell
                    align="right"
                    onClick={() =>
                      toggleStatus(expense.id, expense.status || "Unpaid")
                    }
                    style={{
                      cursor: "pointer",
                      color: expense.status === "Paid" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {expense.status || "Unpaid"}
                  </TableCell>
                  <TableCell align="right">
                    <button onClick={() => openEditModal(expense)}>Edit</button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={isEditModalOpen} onClose={closeEditModal}>
          <DialogTitle>Edit Expense</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="title"
              value={selectedExpense?.title || ""}
              onChange={handleEditChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={selectedExpense?.amount || ""}
              onChange={handleEditChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              value={selectedExpense?.date || ""}
              onChange={handleEditChange}
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Category"
              name="category"
              value={selectedExpense?.category || ""}
              onChange={handleEditChange}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Description"
              name="description"
              value={selectedExpense?.description || ""}
              onChange={handleEditChange}
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditModal}>Cancel</Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ExpenseList;
