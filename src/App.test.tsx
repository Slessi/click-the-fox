import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { milliseconds } from "date-fns";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  localStorage.clear();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

describe("Click the Fox! Game App", () => {
  it("renders welcome screen and allows name input", async () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /click the fox/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /play/i })).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText(/your name/i), "Alice");

    expect(screen.getByRole("button", { name: /play/i })).toBeEnabled();
  });

  it("starts a game after entering name and clicking play", async () => {
    render(<App />);

    await userEvent.type(screen.getByPlaceholderText(/your name/i), "Bob");
    await userEvent.click(screen.getByRole("button", { name: /play/i }));

    expect(await screen.findByText(/score:/i)).toBeInTheDocument();
    expect(screen.getByText(/time left:/i)).toBeInTheDocument();

    const images = await screen.findAllByAltText("animal");
    expect(images.length).toBe(9);
  });

  it("increases score when clicking fox image and decreases when clicking cat image", async () => {
    render(<App />);

    await userEvent.type(screen.getByPlaceholderText(/your name/i), "Carol");
    await userEvent.click(screen.getByRole("button", { name: /play/i }));

    // Wait for images
    const images = screen.getAllByAltText("animal");

    // The fox image is always https://randomfox.ca/images/108.jpg in MSW mock
    const foxImage = images.find((img) =>
      img.getAttribute("src")?.includes("https://randomfox.ca/images/108.jpg")
    );

    const catImage = images.find((img) =>
      img
        .getAttribute("src")
        ?.includes("https://cdn2.thecatapi.com/images/17q.jpg")
    );

    expect(foxImage).toBeTruthy();
    expect(catImage).toBeTruthy();

    // Initial score is 0
    expect(screen.getByLabelText("score")).toHaveTextContent(/score:\s*0/i);

    // Click fox (score +1)
    await userEvent.click(foxImage!);
    await waitFor(() =>
      expect(screen.getByLabelText("score")).toHaveTextContent(/score:\s*1/i)
    );

    // Click cat (score -1)
    await userEvent.click(catImage!);
    await waitFor(() =>
      expect(screen.getByLabelText("score")).toHaveTextContent(/score:\s*0/i)
    );
  });

  it("shows scoreboard with scores after timer expires", async () => {
    render(<App />);

    await userEvent.type(screen.getByPlaceholderText(/your name/i), "Dana");
    await userEvent.click(screen.getByRole("button", { name: /play/i }));

    // Simulate clicking fox 3 times
    for (let i = 0; i < 3; i++) {
      const foxImage = screen
        .getAllByAltText("animal")
        .find((img) =>
          img
            .getAttribute("src")
            ?.includes("https://randomfox.ca/images/108.jpg")
        );

      expect(foxImage).toBeTruthy();

      await userEvent.click(foxImage!);
    }

    // Fast-forward timer to expire
    vi.advanceTimersByTime(milliseconds({ seconds: 30 }));

    // Scoreboard should show
    expect(
      await screen.findByRole("heading", { name: /scoreboard/i })
    ).toBeInTheDocument();

    // Should show Dana and score 3
    const row = screen.getByText("Dana").closest("tr");
    expect(row).toBeInTheDocument();
    expect(within(row!).getByText("3")).toBeInTheDocument();
  });

  it("can restart game from scoreboard and play again", async () => {
    render(<App />);

    await userEvent.type(screen.getByPlaceholderText(/your name/i), "Eve");
    await userEvent.click(screen.getByRole("button", { name: /play/i }));

    // Fast-forward timer to expire
    vi.advanceTimersByTime(milliseconds({ seconds: 30 }));

    expect(
      await screen.findByRole("heading", { name: /scoreboard/i })
    ).toBeInTheDocument();

    // Click PLAY! to play again
    await userEvent.click(screen.getByRole("button", { name: /^play!$/i }));

    // Should be back in game
    expect(await screen.findByText(/score:/i)).toBeInTheDocument();
  });

  it("can restart game from scoreboard and enter a new name", async () => {
    render(<App />);

    await userEvent.type(screen.getByPlaceholderText(/your name/i), "Eve");
    await userEvent.click(screen.getByRole("button", { name: /play/i }));

    // Fast-forward timer to expire
    vi.advanceTimersByTime(milliseconds({ seconds: 30 }));

    expect(
      await screen.findByRole("heading", { name: /scoreboard/i })
    ).toBeInTheDocument();

    // Click To Welcome Screen
    await userEvent.click(
      screen.getByRole("button", { name: /to welcome screen/i })
    );

    expect(
      await screen.findByPlaceholderText(/your name/i)
    ).toBeInTheDocument();
  });
});
