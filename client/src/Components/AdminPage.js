import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Table, Alert, Button, Input } from "reactstrap";
import { SERVER_URL } from "../config";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [designerRequests, setDesignerRequests] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userLocations, setUserLocations] = useState({}); // Store user locations
  const user = useSelector((state) => state.users.user);


  // Helper to fetch location for a given IP
  const fetchLocationForIp = async (ip) => {
    const isLocal = !ip || ip === '127.0.0.1' || ip === '::1';
    if (isLocal) return "Oman";
    try {
      // Use ip-api.com for better Oman support
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      if (response.data && response.data.status === "success") {
        const { city, country } = response.data;
        if (country === "Oman") {
          return city ? `${city}, Oman` : "Oman";
        }
        return country || "N/A";
      }
      return "Oman";
    } catch (error) {
      return "Oman";
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/getAllUsers`);
        console.log("Fetched users:", response.data.users); // Debugging log
        setUsers(response.data.users);
        // Fetch location for each user if IP is available
        const locations = {};
        await Promise.all(
          response.data.users.map(async (u) => {
            if (u.ip) {
              const loc = await fetchLocationForIp(u.ip);
              locations[u._id] = loc;
            } else {
              locations[u._id] = "N/A";
            }
          })
        );
        setUserLocations({ ...locations });
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again later.");
      }
    };

    const fetchDesignerRequests = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/allDesignerRequests`);
        setDesignerRequests(response.data.requests);
      } catch (error) {
        // Optionally handle error
      }
    };

    fetchUsers();
    fetchDesignerRequests();
  }, []);

  const handleUserTypeChange = async (userId, newType) => {
    try {
      const response = await axios.put(`${SERVER_URL}/updateUserType/${userId}`, { userType: newType });
      setSuccessMessage(response.data.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === userId ? { ...user, userType: newType } : user))
      );
    } catch (error) {
      console.error("Error updating user type:", error);
      setError("Failed to update user type. Please try again later.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await axios.delete(`${SERVER_URL}/deleteUser/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      setSuccessMessage("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user. Please try again later.");
    }
  };

  if (!user || user.userType !== "admin") {
    return <p>You do not have permission to view this page.</p>;
  }

  // Add additional debugging logs to verify the users state
  console.log("Users state in AdminPage:", users); // Debugging log

  return (
    <Container>
      <h1 className="text-center my-4">All User Accounts</h1>
      {error && <Alert color="danger">{error}</Alert>}
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      {users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th scope="row">{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Input
                    type="select"
                    value={user.userType}
                    onChange={(e) => handleUserTypeChange(user._id, e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="designer">Designer</option>
                  </Input>
                </td>
                <td>{userLocations[user._id] || "N/A"}</td>
                <td>
                  <Button color="danger" size="sm" onClick={() => handleDeleteUser(user._id)} disabled={user.userType === "admin"}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {designerRequests.length > 0 && (
        <>
          <h2 className="text-center my-4">Designer Requests</h2>
          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Portfolio</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {designerRequests.map((req, idx) => (
                <tr key={req._id}>
                  <th scope="row">{idx + 1}</th>
                  <td>{req.name}</td>
                  <td>{req.email}</td>
                  <td>{req.message}</td>
                  <td>{req.portfolio ? <a href={req.portfolio} target="_blank" rel="noopener noreferrer">View</a> : ""}</td>
                  <td>{new Date(req.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default AdminPage;