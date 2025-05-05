import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";
import { SERVER_URL } from "../../config";
import { FaHeart } from "react-icons/fa";

const Illustration = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [postMsg, setPostMsg] = useState("");
  const [image, setImage] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const user = useSelector((state) => state.users.user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/getPostsByCategory`);
        const categoryPosts = response.data.postsByCategory.find(
          (category) => category._id === "Illustration"
        );
        setPosts(categoryPosts ? categoryPosts.posts : []);
        setError(null);
        // Set liked posts for current user
        if (user && categoryPosts) {
          const liked = categoryPosts.posts.filter(post => post.likes && post.likes.users && post.likes.users.includes(user._id)).map(post => post._id);
          setLikedPosts(liked);
        }
      } catch (error) {
        console.error("Error fetching Illustration posts:", error);
        setError("Failed to load posts. Please try again later.");
      }
    };

    fetchPosts();
  }, [user]);

  const handlePost = async () => {
    if (user.userType !== "designer") {
      alert("Only designers can share posts.");
      return;
    }

    const formData = new FormData();
    formData.append("postMsg", postMsg);
    formData.append("email", user.email);
    formData.append("category", "Illustration");
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${SERVER_URL}/savePost`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Post successfully saved!");
        setPosts((prevPosts) => [result.post, ...prevPosts]);
        setPostMsg("");
        setImage(null);
      } else {
        alert("Failed to save post. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while saving the post.");
    }
  };

  const handleLikePost = async (postId) => {
    if (likedPosts.includes(postId)) return; // Prevent multiple likes
    try {
      const response = await axios.put(`${SERVER_URL}/likePost/${postId}`, { userId: user._id });
      setPosts((prevPosts) => prevPosts.map((post) => post._id === postId ? response.data.post : post));
      setLikedPosts((prev) => [...prev, postId]);
    } catch (error) {
      alert("Failed to like post.");
    }
  };

  const postStyle = {
    border: "1px solid #d1d9e6", // Subtle border
    borderRadius: "12px",
    padding: "20px",
    margin: "15px 0",
    background: "linear-gradient(135deg, #f0f4ff, #dce6f9)", // Soft gradient
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)", // Soft shadow
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    maxWidth: "450px",
    textAlign: "center",
    overflow: "hidden",
  };

  const postTitleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2c3e50", // Darker text color
    marginBottom: "12px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  };

  const postImageStyle = {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "12px",
  };

  const postFooterStyle = {
    fontSize: "14px",
    color: "#7f8c8d", // Muted text color
    marginTop: "10px",
  };

  const textareaStyle = {
    width: "100%",
    height: "80px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    marginBottom: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const fileInputStyle = {
    display: "block",
    margin: "10px 0",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
  };

  const buttonStyle = {
    backgroundColor: "#007BFF", // Blue color
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3", // Darker blue on hover
  };

  return (
    <div className="category-page">
      <h1>Illustration</h1>
      {user.userType === "designer" && (
        <div className="share-post">
          <textarea
            style={textareaStyle}
            placeholder="What's on your mind?"
            value={postMsg}
            onChange={(e) => setPostMsg(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            style={fileInputStyle}
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
            onClick={handlePost}
          >
            Post
          </button>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      <div>
        {posts.length > 0 ? (
          <Row>
            {posts.map((post, index) => (
              <Col md="4" className="mb-4" key={index}>
                <Card>
                  <div key={post._id} style={postStyle}>
                    <h3 style={postTitleStyle}>{post.postMsg}</h3>
                    {post.image && (
                      <img
                        src={`${SERVER_URL}/uploads/${post.image}`}
                        alt={`Illustration Post: ${post.postMsg}`}
                        style={postImageStyle}
                      />
                    )}
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
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          !error && <p>No posts available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default Illustration;