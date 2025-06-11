import * as React from "react"
import { render, screen } from "@testing-library/react"
import DeepResearchLibrary from "../src/components/research/DeepResearchLibrary"

describe("DeepResearchLibrary", () => {
  test("renders without crashing", () => {
    render(<DeepResearchLibrary />)
    expect(screen.getByText("Deep Research Library")).toBeInTheDocument()
  })

  test("shows collaborative AI research subtitle", () => {
    render(<DeepResearchLibrary />)
    expect(screen.getByText("Collaborative AI Research with Claude & Gemini")).toBeInTheDocument()
  })

  test("has research input section", () => {
    render(<DeepResearchLibrary />)
    expect(screen.getByText("Research Query")).toBeInTheDocument()
  })

  test("shows depth configuration options", () => {
    render(<DeepResearchLibrary />)
    expect(screen.getByText("Quick Search")).toBeInTheDocument()
    expect(screen.getByText("Deep Research")).toBeInTheDocument()
    expect(screen.getByText("Deep Deep Research")).toBeInTheDocument()
  })

  test("displays AI model selection", () => {
    render(<DeepResearchLibrary />)
    expect(screen.getByText("Claude 3.5 Sonnet")).toBeInTheDocument()
    expect(screen.getByText("Gemini 2.0 Flash")).toBeInTheDocument()
  })
})
