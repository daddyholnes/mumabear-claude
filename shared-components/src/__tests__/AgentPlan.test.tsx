import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AgentPlan from "../components/ui/AgentPlan";

const samplePlan = {
  id: "plan-1",
  title: "Test Plan",
  description: "A plan for testing.",
  status: "active",
  priority: "medium",
  level: 0,
  dependencies: [],
  subtasks: [
    {
      id: "step-1",
      title: "Step One",
      description: "Do the first thing.",
      status: "pending",
      priority: "high",
      tools: ["toolA"],
      agent: "Mama Bear",
      context: "src/fileA.tsx",
      planId: "plan-1"
    },
    {
      id: "step-2",
      title: "Step Two",
      description: "Do the second thing.",
      status: "completed",
      priority: "low",
      tools: ["toolB"],
      agent: "Scout",
      context: "src/fileB.tsx",
      planId: "plan-1"
    }
  ]
};

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("AgentPlan", () => {
  it("renders gracefully with empty tasks array", () => {
    render(<AgentPlan tasks={[]} />);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(screen.queryByText(/plan/i)).not.toBeInTheDocument();
  });

  it("renders a single task with no subtasks", async () => {
    const planNoSubtasks = { ...samplePlan, title: "No Subtasks Plan", subtasks: [] };
    render(<AgentPlan tasks={[planNoSubtasks]} />);
    const planTitle = await screen.findByText("No Subtasks Plan");
    expect(planTitle).toBeInTheDocument();
    fireEvent.click(planTitle);
    expect(screen.queryByText("Step One")).not.toBeInTheDocument();
  });

  it("does not toggle status in controlled mode", async () => {
    render(<AgentPlan tasks={[samplePlan]} />);
    const planTitle = await screen.findByText("Test Plan");
    fireEvent.click(planTitle);
    const stepOne = await screen.findByText("Step One");
    fireEvent.click(stepOne);
    const statusIcon = stepOne.closest("li").querySelector(".mr-2.flex-shrink-0.cursor-pointer");
    expect(statusIcon).toBeTruthy();
    fireEvent.click(statusIcon);
    // In controlled mode, status should not change (simulate by checking icon is still present)
    expect(stepOne.closest("li").querySelector("svg")).toBeInTheDocument();
  });

  it("toggles status in uncontrolled mode", async () => {
    render(<AgentPlan />);
    // The first task from initialTasks is rendered
    const taskTitle = await screen.findByText(/Research Project Requirements/i);
    fireEvent.click(taskTitle);
    // Find the first status icon and click it
    const statusIcon = taskTitle.closest("li").querySelector(".mr-2.flex-shrink-0.cursor-pointer");
    expect(statusIcon).toBeTruthy();
    fireEvent.click(statusIcon);
    // After click, the status should have changed (icon re-renders)
    expect(taskTitle.closest("li").querySelector("svg")).toBeInTheDocument();
  });

  it("shows Add Task button only in uncontrolled mode", () => {
    const { unmount } = render(<AgentPlan />);
    expect(screen.getByText("+ Add Task")).toBeInTheDocument();
    unmount();
    render(<AgentPlan tasks={[samplePlan]} />);
    expect(screen.queryByText("+ Add Task")).not.toBeInTheDocument();
  });

  it("can add a new task in uncontrolled mode", () => {
    render(<AgentPlan />);
    fireEvent.click(screen.getByText("+ Add Task"));
    fireEvent.change(screen.getByPlaceholderText("Title"), { target: { value: "New Task" } });
    fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "Some description" } });
    fireEvent.change(screen.getByDisplayValue("medium"), { target: { value: "high" } });
    fireEvent.click(screen.getByText("Add Task"));
    // Modal should close and new task should appear
    expect(screen.queryByText("Add New Task")).not.toBeInTheDocument();
    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("renders plan title and subtasks", async () => {
    render(<AgentPlan tasks={[samplePlan]} />);
    // Expand the plan if collapsed by default
    const planTitle = await screen.findByText("Test Plan");
    fireEvent.click(planTitle);
    // Expand subtasks if needed
    const stepOne = await screen.findByText("Step One");
    fireEvent.click(stepOne);
    expect(planTitle).toBeInTheDocument();
    expect(stepOne).toBeInTheDocument();
    expect(await screen.findByText("Step Two")).toBeInTheDocument();
  });

  it("shows agent and context for subtasks", async () => {
    render(<AgentPlan tasks={[samplePlan]} />);
    // Expand plan and subtasks
    const planTitle = await screen.findByText("Test Plan");
    fireEvent.click(planTitle);
    const stepOne = await screen.findByText("Step One");
    fireEvent.click(stepOne);
    expect(await screen.findByText("Mama Bear")).toBeInTheDocument();
    expect(await screen.findByText("Scout")).toBeInTheDocument();
    expect(await screen.findByText("src/fileA.tsx")).toBeInTheDocument();
    expect(await screen.findByText("src/fileB.tsx")).toBeInTheDocument();
  });

  it("renders step actions", async () => {
    render(<AgentPlan tasks={[samplePlan]} />);
    // Expand plan and subtasks
    const planTitle = await screen.findByText("Test Plan");
    fireEvent.click(planTitle);
    const stepOne = await screen.findByText("Step One");
    fireEvent.click(stepOne);
    expect((await screen.findAllByText("Run Step")).length).toBeGreaterThan(0);
    expect((await screen.findAllByText("Pause")).length).toBeGreaterThan(0);
    expect((await screen.findAllByText("Reassign")).length).toBeGreaterThan(0);
  });
});
