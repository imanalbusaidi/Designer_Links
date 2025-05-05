import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Contact from "../src/Components/Contact";

const mockStore = configureStore([]);

describe("Contact component", () => {
  it("renders form and allows input changes", () => {
    const store = mockStore({ users: { user: { name: "Test User", email: "test@example.com", userType: "customer" } } });
    render(
      <Provider store={store}>
        <Contact />
      </Provider>
    );
    expect(screen.getByLabelText(/Name/i)).toBeTruthy();
    expect(screen.getByLabelText(/Email/i)).toBeTruthy();
    expect(screen.getByLabelText(/Portfolio/i)).toBeTruthy();
    expect(screen.getByLabelText(/Why do you want to become a designer/i)).toBeTruthy();
    // Change message field
    const messageInput = screen.getByLabelText(/Why do you want to become a designer/i);
    fireEvent.change(messageInput, { target: { value: "Because I love design!" } });
    expect(messageInput.value).toBe("Because I love design!");
  });
});
