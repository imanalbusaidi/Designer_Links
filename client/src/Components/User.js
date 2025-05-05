import React from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, CardBody, CardImg, CardTitle, CardText } from "reactstrap";
import { SERVER_URL } from "../config";

const User = () => {
  const user = useSelector((state) => state.users.user);
  const picURL = `${SERVER_URL}/uploads/user.png`;

  return (
    <Card className="user-card">
      <CardImg top src={picURL} alt="User Profile" className="user-image" />
      <CardBody>
        <CardTitle tag="h5" className="user-name">
          {user.name}
        </CardTitle>
        <CardText className="user-email">{user.email}</CardText>
      </CardBody>
    </Card>
  );
};

export default User;
