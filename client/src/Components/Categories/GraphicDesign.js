import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Row, Col, Card } from "react-bootstrap";
import { SERVER_URL } from "../../config";
import { FaHeart } from "react-icons/fa";

const GraphicDesign = () => {
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
          (category) => category._id === "Graphic Design"
        );
        setPosts(categoryPosts ? categoryPosts.posts : []);
        setError(null); // Clear any previous errors
        // Set liked posts for current user
        if (user && categoryPosts) {
          const liked = categoryPosts.posts.filter(post => post.likes && post.likes.users && post.likes.users.includes(user._id)).map(post => post._id);
          setLikedPosts(liked);
        }
      } catch (error) {
        console.error("Error fetching Graphic Design posts:", error);
        setError("Failed to load posts. Please try again later.");
      }
    };

    fetchPosts();
  }, [user]);

  const handlePost = async () => {
    if (!user || user.userType !== "designer") {
      alert("Only designers can share posts.");
      return;
    }

    const formData = new FormData();
    formData.append("postMsg", postMsg);
    formData.append("email", user.email);
    formData.append("category", "Graphic Design");
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

  // Filter out placeholder posts with specific patterns
  const filteredPosts = posts.filter(
    (post) => !post.postMsg.startsWith("This is a post about Graphic Design by")
  );

  const postStyle = {
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 4px 24px rgba(106,27,154,0.10)",
    padding: "28px 20px 20px 20px",
    margin: "18px 0",
    maxWidth: "420px",
    textAlign: "center",
    transition: "transform 0.25s, box-shadow 0.25s",
    border: "1.5px solid #ece6f7",
    position: "relative",
    overflow: "hidden",
  };

  const postTitleStyle = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#6a1b9a",
    marginBottom: "14px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    letterSpacing: "0.5px",
  };

  const postImageStyle = {
    width: "100%",
    maxHeight: "260px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "14px",
    boxShadow: "0 2px 12px #6a1b9a11",
  };

  const postFooterStyle = {
    fontSize: "15px",
    color: "#7f8c8d",
    marginTop: "12px",
    fontStyle: "italic",
  };

  const textareaStyle = {
    width: "100%",
    height: "80px",
    borderRadius: "10px",
    border: "1.5px solid #d1d9e6",
    padding: "12px",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    marginBottom: "12px",
    boxShadow: "0 2px 8px #6a1b9a08",
    resize: "vertical",
    background: "#fafaff",
    outline: "none",
    transition: "border 0.2s",
  };

  const fileInputStyle = {
    display: "block",
    margin: "10px 0 18px 0",
    fontSize: "15px",
    fontFamily: "Arial, sans-serif",
    border: "1.5px solid #ece6f7",
    borderRadius: "8px",
    padding: "7px 12px",
    background: "#f3f0fa",
    color: "#6a1b9a",
    cursor: "pointer",
    outline: "none",
    transition: "border 0.2s",
  };

  const buttonStyle = {
    background: "linear-gradient(90deg, #6a1b9a, #8e24aa)",
    color: "#fff",
    border: "none",
    padding: "12px 32px",
    borderRadius: "24px",
    fontWeight: "600",
    fontSize: "1.08rem",
    boxShadow: "0 2px 8px #6a1b9a22",
    cursor: "pointer",
    marginTop: "4px",
    marginBottom: "8px",
    transition: "background 0.2s, transform 0.2s",
    outline: "none",
  };

  const buttonHoverStyle = {
    background: "linear-gradient(90deg, #4a116a, #6a1b9a)",
  };

  return (
    <div className="category-page">
      <h1>Graphic Design</h1>
      <p>Explore amazing content in the Graphic Design category!</p>
      {user && user.userType === "designer" && (
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
        {filteredPosts.length > 0 ? (
          <Row>
            {filteredPosts.map((post, index) => (
              <Col md="4" className="mb-4" key={index}>
                <Card>
                  <div key={post._id} style={postStyle}>
                    <h3 style={postTitleStyle}>{post.postMsg}</h3>
                    {post.image && (
                      <img
                        src={`${SERVER_URL}/uploads/${post.image}`}
                        alt={`Graphic Design Post: ${post.postMsg}`}
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

export default GraphicDesign;