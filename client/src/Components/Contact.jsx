import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { SERVER_URL } from "../config";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    portfolio: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const user = useSelector((state) => state.users.user);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, name: user.name || "", email: user.email || "" }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/requestDesigner`, formData);
      setSuccessMessage(response.data.message || "Your request has been submitted.");
      setFormData({ name: "", email: "", message: "", portfolio: "" });
      setError(null);
    } catch (error) {
      const backendMsg = error.response?.data?.error || (error.response?.data?.errors && error.response.data.errors[0]?.msg);
      setError(backendMsg || "Failed to submit your request. Please try again later.");
      setSuccessMessage(null);
      console.log("Designer request error:", error.response?.data || error);
    }
  };

  if (!user || user.userType !== "customer") {
    return <p>You do not have permission to view this page.</p>;
  }

  return (
    <Container>
      <h1 className="text-center my-4">Request to Become a Designer</h1>
      {error && <Alert color="danger">{error}</Alert>}
      {successMessage && <Alert color="success">{successMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={!!user?.name}
          />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={!!user?.email}
          />
        </FormGroup>
        <FormGroup>
          <Label for="portfolio">Portfolio (optional)</Label>
          <Input
            type="url"
            name="portfolio"
            id="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            placeholder="https://your-portfolio.com"
          />
        </FormGroup>
        <FormGroup>
          <Label for="message">Why do you want to become a designer?</Label>
          <Input
            type="textarea"
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Submit Request
        </Button>
      </Form>
    </Container>
  );
};

export default Contact;