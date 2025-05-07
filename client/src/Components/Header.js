import { useLocation } from "react-router-dom";
import { Navbar, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../Features/UserSlice";
import '../App.css';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SERVER_URL } from "../config";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const bellRef = useRef();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user.userType === "designer") {
        try {
          const res = await axios.get(`${SERVER_URL}/designerRequests/${user._id}`);
          setNotifications(res.data.requests || []);
          console.log("Fetched notifications:", res.data.requests);
        } catch (err) {
          setNotifications([]);
        }
      }
    };
    fetchNotifications();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  // Hide header on login and register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <Navbar color="light" light expand="md" className="header">
      <Link to="/" className="logo-text">DesignerLink</Link>
      <Nav>
        <NavItem>
          <NavLink tag={Link} to="/" className="nav-link">Home</NavLink>
        </NavItem>
        {user ? (
          <>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="nav-link">
                Categories
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem tag={Link} to="/categories/graphic-design">
                  Graphic Design
                </DropdownItem>
                <DropdownItem tag={Link} to="/categories/3d-design">
                  3D Design
                </DropdownItem>
                <DropdownItem tag={Link} to="/categories/illustration">
                  Illustration
                </DropdownItem>
                <DropdownItem tag={Link} to="/categories/ui-ux">
                  UI/UX
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            {/* Notification bell and dropdown removed */}
            {user.userType !== "customer" && user.userType !== "admin" && (
              <NavItem>
                <NavLink tag={Link} to="/profile" className="nav-link">Profile</NavLink>
              </NavItem>
            )}
            {user && user.userType === "customer" && (
              <NavItem>
                <NavLink tag={Link} to="/contact" className="nav-link">Contact</NavLink>
              </NavItem>
            )}
            {user && user.userType === "admin" && (
              <NavItem>
                <NavLink tag={Link} to="/admin" className="nav-link">Admin</NavLink>
              </NavItem>
            )}
            <NavItem>
              <NavLink onClick={handleLogout} className="nav-link">Logout</NavLink>
            </NavItem>
          </>
        ) : (
          <NavItem>
            <NavLink tag={Link} to="/login" className="nav-link">Login</NavLink>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;
