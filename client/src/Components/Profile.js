import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../config";
import { FaHeart } from "react-icons/fa";

const titleStyle = {
  color: "#FF4500", // Vibrant orange-red color
  fontFamily: "'Montserrat', sans-serif", // Modern and cool font
  fontSize: "32px", // Slightly larger font size
  fontWeight: "700", // Extra bold for emphasis
  padding: "25px 0", // Add more padding
  textAlign: "center", // Center align the text
  textTransform: "uppercase", // Make the text uppercase
  letterSpacing: "2px", // Add spacing between letters
};

const postFooterStyle = {
  fontSize: "14px",
  color: "#7f8c8d",
  marginTop: "10px",
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
              <Card>
                {post.image && (
                  <img
                    src={`${SERVER_URL}/uploads/${post.image}`}
                    alt="Post"
                    className="card-img-top"
                    onClick={() => handleViewProfile(post.email)} // Link to designer's profile
                    style={{ cursor: user.userType === "customer" ? "pointer" : "default" }}
                  />
                )}
                <CardBody>
                  <CardTitle tag="h5">{post.postMsg}</CardTitle>
                  <CardText>{post.category}</CardText>
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
                      color="danger"
                      className="mt-2"
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