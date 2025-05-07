import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../config";
import { FaHeart } from "react-icons/fa";

const titleStyle = {
  fontFamily: "Montserrat, Arial, sans-serif",
  fontSize: "2.2rem",
  fontWeight: 700,
  margin: "30px 0 20px 0",
  textAlign: "center"
};

const postFooterStyle = {
  fontSize: "14px",
  color: "#7f8c8d",
  marginTop: "10px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "18px",
  boxShadow: "0 4px 24px rgba(106,27,154,0.10)",
  padding: "24px 18px 18px 18px",
  margin: "18px 0",
  maxWidth: "420px",
  textAlign: "center",
  transition: "transform 0.25s, box-shadow 0.25s",
  border: "1.5px solid #ece6f7",
  position: "relative",
  overflow: "hidden",
};

const cardImageStyle = {
  width: "100%",
  maxHeight: "220px",
  objectFit: "cover",
  marginBottom: "14px",
  boxShadow: "0 2px 12px #6a1b9a11",
  cursor: "pointer",
};

const cardTitleStyle = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#6a1b9a",
  marginBottom: "10px",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  letterSpacing: "0.5px",
};

const cardCategoryStyle = {
  fontSize: "15px",
  color: "#8e24aa",
  fontWeight: 500,
  marginBottom: "8px",
};

const deleteButtonStyle = {
  background: "linear-gradient(90deg,rgb(198, 35, 35),rgb(203, 87, 87))",
  color: "#fff",
  border: "none",
  padding: "10px 28px",
  borderRadius: "20px",
  fontWeight: "600",
  fontSize: "1rem",
  boxShadow: "0 2px 8px #e5393522",
  cursor: "pointer",
  marginTop: "8px",
  marginBottom: "4px",
  transition: "background 0.2s, transform 0.2s",
  outline: "none",
};

const Profile = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.email) {
      const fetchUserPosts = async () => {
        try {
          const response = await axios.get(`${SERVER_URL}/getPosts`);
          const posts = response.data.posts.filter((post) => post.email === user.email);
          setUserPosts(posts);
          // Set liked posts for customer
          if (user.userType === "customer") {
            const liked = posts.filter(post => post.likes && post.likes.users && post.likes.users.includes(user._id)).map(post => post._id);
            setLikedPosts(liked);
          }
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      };

      fetchUserPosts();
    }
  }, [user]);

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${SERVER_URL}/deletePost/${postId}`);
      setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      alert("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handleViewProfile = (email) => {
    if (user.userType === "customer") {
      navigate(`/profile/${email}`); // Navigate to the designer's profile
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await axios.put(`${SERVER_URL}/likePost/${postId}`, { userId: user._id });
      setUserPosts((prevPosts) => prevPosts.map((post) =>
        post._id === postId ? { ...post, likes: res.data.post.likes } : post
      ));
      // Update likedPosts state
      if (res.data.message === "Post liked.") {
        setLikedPosts((prev) => [...prev, postId]);
      } else {
        setLikedPosts((prev) => prev.filter(id => id !== postId));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <Container>
      <h1 className="text-center mb-4" style={titleStyle}>Your Posts</h1>
      <Row>
        {userPosts.length > 0 ? (
          userPosts.map((post, index) => (
            <Col md="4" className="mb-4" key={index}>
              <Card style={cardStyle}>
                {post.image && (
                  <img
                    src={`${SERVER_URL}/uploads/${post.image}`}
                    alt="Post"
                    style={cardImageStyle}
                    onClick={() => handleViewProfile(post.email)}
                  />
                )}
                <CardBody>
                  <CardTitle tag="h5" style={cardTitleStyle}>{post.postMsg}</CardTitle>
                  <CardText style={cardCategoryStyle}>{post.category}</CardText>
                  <p style={postFooterStyle}>Posted by: {post.userName} ({post.email})</p>
                  {user && user.userType === "customer" && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', marginTop: 8 }}>
                      <FaHeart
                        style={{ color: likedPosts.includes(post._id) ? 'red' : '#ccc', cursor: likedPosts.includes(post._id) ? 'not-allowed' : 'pointer', fontSize: 22 }}
                        onClick={() => handleLikePost(post._id)}
                        disabled={likedPosts.includes(post._id)}
                      />
                      <span style={{ marginLeft: 6, fontWeight: 500 }}>{post.likes && post.likes.count ? post.likes.count : 0}</span>
                    </span>
                  )}
                  {user.userType === "designer" && (
                    <Button
                      style={deleteButtonStyle}
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </Button>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No posts found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Profile;