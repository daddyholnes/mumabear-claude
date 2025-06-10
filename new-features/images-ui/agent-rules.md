# kilo & muma bear Rules

> Recommended .kilorules & .mumbearrules for working with kilo

## .kilorules
## .mumbearrules

<Tabs>
  <Tab title="Python">
    ```md .kilorules
    You are working with Scrapybara, a Python SDK for deploying and managing remote desktop instances for AI agents. Use this guide to properly interact with the SDK.

    **CORE SDK USAGE:**
    - Initialize client: from scrapybara import Scrapybara; client = Scrapybara(api_key="KEY")
    - Instance lifecycle:
        instance = client.start_ubuntu(timeout_hours=1)
        instance.pause() # Pause to save resources
        instance.resume(timeout_hours=1) # Resume work
        instance.stop() # Terminate and clean up
    - Instance types:
        ubuntu_instance = client.start_ubuntu(): supports bash, computer, edit, browser
        browser_instance = client.start_browser(): supports computer, browser
        windows_instance = client.start_windows(): supports computer

    **TYPE IMPORTS:**
    - Core types:
        from scrapybara import Scrapybara
    - Instance types:
        from scrapybara.client import UbuntuInstance, BrowserInstance, WindowsInstance
    - Tool types:
        from scrapybara.tools import Tool, BashTool, ComputerTool, EditTool
    - Model types:
        from scrapybara.anthropic import Anthropic
    - Message types:
        from pydantic import BaseModel
        from typing import List, Union, Optional, Any
    - Error types:
        from scrapybara.core.api_error import ApiError

    **CORE INSTANCE OPERATIONS:**
    - Screenshots: instance.screenshot().base_64_image
    - Bash commands: instance.bash(command="ls -la")
    - Mouse control: instance.computer(action="move_mouse", coordinates=[x, y])
    - Click actions: instance.computer(action="click_mouse", button="right", coordinates=[x, y])
    - Drag actions: instance.computer(action="drag_mouse", path=[[x1, y1], [x2, y2]])
    - Scroll actions: instance.computer(action="scroll", coordinates=[x, y], delta_x=0, delta_y=0)
    - Key actions: instance.computer(action="press_key", keys=[keys])
    - Type actions: instance.computer(action="type_text", text="Hello world")
    - Wait actions: instance.computer(action="wait", duration=3)
    - Get cursor position: instance.computer(action="get_cursor_position").output
    - File operations: instance.file.read(path="/path/file"), instance.file.write(path="/path/file", content="data")

    **ACT SDK (Primary Focus):**
    - Purpose: Enables building computer use agents with unified tools and model interfaces
    - Core components:
    1. Model: Handles LLM integration (currently Anthropic)
        from scrapybara.anthropic import Anthropic
        model = Anthropic() # Or model = Anthropic(api_key="KEY") for own key
    2. Tools: Interface for computer interactions
        - BashTool: Run shell commands
        - ComputerTool: Mouse/keyboard control
        - EditTool: File operations
        tools = [
            BashTool(instance),
            ComputerTool(instance),
            EditTool(instance),
        ]
    3. Prompt:
        - system: system prompt, recommend to use UBUNTU_SYSTEM_PROMPT, BROWSER_SYSTEM_PROMPT, WINDOWS_SYSTEM_PROMPT
        - prompt: simple user prompt
        - messages: list of messages
        - Only include either prompt or messages, not both
    response = client.act(
        model=Anthropic(),
        tools=tools,
        system=UBUNTU_SYSTEM_PROMPT,
        prompt="Task",
        on_step=handle_step
    )
    messages = response.messages
    steps = response.steps
    text = response.text
    output = response.output
    usage = response.usage

    **MESSAGE HANDLING:**
    - Response Structure: Messages are structured with roles (user/assistant/tool) and typed content
    - Content Types:
    - TextPart: Simple text content
        TextPart(type="text", text="content")
    - ImagePart: Base64 or URL images
        ImagePart(type="image", image="base64...", mime_type="image/png")
    - ReasoningPart: Model reasoning content
        ReasoningPart(
            type="reasoning",
            id="id",
            reasoning="reasoning",
            signature="signature",
            instructions="instructions"
        )
    - ToolCallPart: Tool invocations
        ToolCallPart(
            type="tool-call",
            tool_call_id="id",
            tool_name="bash",
            args={"command": "ls"}
        )
    - ToolResultPart: Tool execution results
        ToolResultPart(
            type="tool-result",
            tool_call_id="id",
            tool_name="bash",
            result="output",
            is_error=False
        )

    **STEP HANDLING:**
    def handle_step(step: Step):
        if step.reasoning_parts:
            print(f"Reasoning: {step.reasoning_parts}")
        if step.text:
            print(f"Text: {step.text}")
        if step.tool_calls:
            for call in step.tool_calls:
                print(f"Tool: {call.tool_name}")
        if step.tool_results:
            for result in step.tool_results:
                print(f"Result: {result.result}")
        print(f"Tokens: {step.usage.total_tokens if step.usage else 'N/A'}")

    **STRUCTURED OUTPUT:**
    Use the schema parameter to define a desired structured output. The response's output field will contain the validated typed data returned by the model.
    class HNSchema(BaseModel):
        class Post(BaseModel):
            title: str
            url: str 
            points: int
        posts: List[Post]
    response = client.act(
        model=Anthropic(),
        tools=tools,
        schema=HNSchema,
        system=SYSTEM_PROMPT,
        prompt="Get the top 10 posts on Hacker News",
    )
    posts = response.output.posts

    **TOKEN USAGE:**
    - Track token usage through TokenUsage objects
    - Fields: prompt_tokens, completion_tokens, total_tokens
    - Available in both Step and ActResponse objects

    **EXAMPLE:**
    from scrapybara import Scrapybara
    from scrapybara.anthropic import Anthropic
    from scrapybara.prompts import UBUNTU_SYSTEM_PROMPT
    from scrapybara.tools import BashTool, ComputerTool, EditTool

    client = Scrapybara()
    instance = client.start_ubuntu()
    instance.browser.start()

    response = client.act(
        model=Anthropic(),
        tools=[
            BashTool(instance),
            ComputerTool(instance),
            EditTool(instance),
        ],
        system=UBUNTU_SYSTEM_PROMPT,
        prompt="Go to the YC website and fetch the HTML",
        on_step=lambda step: print(f"{step}\n"),
    )
    messages = response.messages
    steps = response.steps
    text = response.text
    output = response.output
    usage = response.usage

    instance.browser.stop()
    instance.stop()

    **EXECUTION PATTERNS:**
    1. Basic agent execution:
    response = client.act(
        model=Anthropic(),
        tools=tools,
        system="System context here",
        prompt="Task description"
    )
    2. Browser automation:
    cdp_url = instance.browser.start().cdp_url
    auth_state_id = instance.browser.save_auth(name="default").auth_state_id  # Save auth
    instance.browser.authenticate(auth_state_id=auth_state_id)  # Reuse auth
    3. File management:
    instance.file.write("/tmp/data.txt", "content")
    content = instance.file.read("/tmp/data.txt").content
    4. Environment variables:
    instance.env.set({"API_KEY": "value"})
    instance.env.get().variables
    instance.env.delete(["VAR_NAME"])

    **ERROR HANDLING:**
    from scrapybara.core.api_error import ApiError
    try:
        client.start_ubuntu()
    except ApiError as e:
        print(f"Error {e.status_code}: {e.body}")

    **IMPORTANT GUIDELINES:**
    - Always stop instances after use to prevent unnecessary billing
    - Use async client (AsyncScrapybara) for non-blocking operations
    - Handle API errors with try/except ApiError blocks
    - Default timeout is 60s; customize with timeout parameter or request_options
    - Instance auto-terminates after 1 hour by default
    - For browser operations, always start browser before BrowserTool usage
    - Prefer bash commands over GUI interactions for launching applications
    ```
  </Tab>

  <Tab title="TypeScript">
    ```md .kilorules
    You are working with Scrapybara, a TypeScript SDK for deploying and managing remote desktop instances for AI agents. Use this guide to properly interact with the SDK.

    **CORE SDK USAGE:**
    - Initialize client: import { ScrapybaraClient } from "scrapybara"; const client = new ScrapybaraClient({ apiKey: "KEY" });
    - Instance lifecycle:
        const instance = await client.startUbuntu({ timeoutHours: 1 });
        await instance.pause(); // Pause to save resources
        await instance.resume({ timeoutHours: 1 }); // Resume work
        await instance.stop(); // Terminate and clean up
    - Instance types:
        const ubuntuInstance = client.startUbuntu(); // supports bash, computer, edit, browser
        const browserInstance = client.startBrowser(); // supports computer, browser
        const windowsInstance = client.startWindows(); // supports computer

    **TYPE IMPORTS:**
    - Core types:
        import { ScrapybaraClient, UbuntuInstance, BrowserInstance, WindowsInstance } from "scrapybara";
    - Tool types:
        import { bashTool, computerTool, editTool } from "scrapybara/tools";
    - Model types:
        import { anthropic } from "scrapybara/anthropic";
    - Message types:
        import { z } from "zod";
    - Error types:
        import { ScrapybaraError } from "scrapybara";
    - Request/Response types:
        import { Scrapybara } from "scrapybara";  // Namespace containing all request/response types

    **CORE INSTANCE OPERATIONS:**
    - Screenshots: const base64Image = await instance.screenshot().base64Image;
    - Bash commands: await instance.bash({ command: "ls -la" });
    - Mouse control: await instance.computer({ action: "move_mouse", coordinates: [x, y] });
    - Click actions: await instance.computer({ action: "click_mouse", button: "right", coordinates: [x, y] });
    - Drag actions: await instance.computer({ action: "drag_mouse", path: [[x1, y1], [x2, y2]] });
    - Scroll actions: await instance.computer({ action: "scroll", coordinates: [x, y], delta_x: 0, delta_y: 0 });
    - Key actions: await instance.computer({ action: "press_key", keys: ["a", "b", "c"] });
    - Type actions: await instance.computer({ action: "type_text", text: "Hello world" });
    - Wait actions: await instance.computer({ action: "wait", duration: 3 });
    - Get cursor position: await instance.computer({ action: "get_cursor_position" });
    - File operations: await instance.file.read({ path: "/path/file" }), await instance.file.write({ path: "/path/file", content: "data" });

    **ACT SDK (Primary Focus):**
    - Purpose: Enables building computer use agents with unified tools and model interfaces
    - Core components:
    1. Model: Handles LLM integration (currently Anthropic)
        import { anthropic } from "scrapybara/anthropic";
        const model = anthropic(); // Or model = anthropic({ apiKey: "KEY" }) for own key
    2. Tools: Interface for computer interactions
        - bashTool: Run shell commands
        - computerTool: Mouse/keyboard control
        - editTool: File operations
        const tools = [
            bashTool(instance),
            computerTool(instance),
            editTool(instance),
        ];
    3. Prompt:
        - system: system prompt, recommend to use UBUNTU_SYSTEM_PROMPT, BROWSER_SYSTEM_PROMPT, WINDOWS_SYSTEM_PROMPT
        - prompt: simple user prompt
        - messages: list of messages
        - Only include either prompt or messages, not both
    const { messages, steps, text, output, usage } = await client.act({
        model: anthropic(),
        tools,
        system: UBUNTU_SYSTEM_PROMPT,
        prompt: "Task",
        onStep: handleStep
    });

    **MESSAGE HANDLING:**
    - Response Structure: Messages are structured with roles (user/assistant/tool) and typed content
    - Content Types:
    - TextPart: Simple text content
        { type: "text", text: "content" }
    - ImagePart: Base64 or URL images
        { type: "image", image: "base64...", mimeType: "image/png" }
    - ReasoningPart: Model reasoning content
        {
            type: "reasoning",
            id: "id",
            reasoning: "reasoning",
            signature: "signature",
            instructions: "instructions"
        }
    - ToolCallPart: Tool invocations
        {
            type: "tool-call",
            toolCallId: "id",
            toolName: "bash",
            args: { command: "ls" }
        }
    - ToolResultPart: Tool execution results
        {
            type: "tool-result",
            toolCallId: "id",
            toolName: "bash",
            result: "output",
            isError: false
        }

    **STEP HANDLING:**
    const handleStep = (step: Step) => {
        console.log(`Text: ${step.text}`);
        if (step.toolCalls) {
            for (const call of step.toolCalls) {
                console.log(`Tool: ${call.toolName}`);
            }
        }
        if (step.toolResults) {
            for (const result of step.toolResults) {
                console.log(`Result: ${result.result}`);
            }
        }
        console.log(`Tokens: ${step.usage?.totalTokens ?? 'N/A'}`);
    };

    **STRUCTURED OUTPUT:**
    Use the schema parameter to define a desired structured output. The response's output field will contain the validated typed data returned by the model.
    const schema = z.object({
        posts: z.array(z.object({
            title: z.string(),
            url: z.string(),
            points: z.number(),
        })),
    });

    const { output } = await client.act({
        model: anthropic(),
        tools,
        schema,
        system: UBUNTU_SYSTEM_PROMPT,
        prompt: "Get the top 10 posts on Hacker News",
    });

    const posts = output.posts;

    **TOKEN USAGE:**
    - Track token usage through TokenUsage objects
    - Fields: promptTokens, completionTokens, totalTokens
    - Available in both Step and ActResponse objects

    **EXAMPLE:**
    import { ScrapybaraClient } from "scrapybara";
    import { anthropic } from "scrapybara/anthropic";
    import { UBUNTU_SYSTEM_PROMPT } from "scrapybara/prompts";
    import { bashTool, computerTool, editTool } from "scrapybara/tools";

    const client = new ScrapybaraClient();
    const instance = await client.startUbuntu();
    await instance.browser.start();

    const { messages, steps, text, output, usage } = await client.act({
        model: anthropic(),
        tools: [
            bashTool(instance),
            computerTool(instance),
            editTool(instance),
        ],
        system: UBUNTU_SYSTEM_PROMPT,
        prompt: "Go to the YC website and fetch the HTML",
        onStep: (step) => console.log(`${step}\n`),
    });

    await instance.browser.stop();
    await instance.stop();

    **EXECUTION PATTERNS:**
    1. Basic agent execution:
    const { messages, steps, text, output, usage } = await client.act({
        model: anthropic(),
        tools,
        system: "System context here",
        prompt: "Task description"
    });
    2. Browser automation:
    const cdpUrl = await instance.browser.start().cdpUrl;
    const authStateId = await instance.browser.saveAuth({ name: "default" }).authStateId;  // Save auth
    await instance.browser.authenticate({ authStateId });  // Reuse auth
    3. File management:
    await instance.file.write({ path: "/tmp/data.txt", content: "content" });
    const content = await instance.file.read({ path: "/tmp/data.txt" }).content;
    4. Environment variables:
    await instance.env.set({ API_KEY: "value" });
    const vars = await instance.env.get().variables;
    await instance.env.delete(["VAR_NAME"]);

    **ERROR HANDLING:**
    import { ApiError } from "scrapybara/core";
    try {
        await client.startUbuntu();
    } catch (e) {
        if (e instanceof ApiError) {
            console.error(`Error ${e.statusCode}: ${e.body}`);
        }
    }

    **IMPORTANT GUIDELINES:**
    - Always stop instances after use to prevent unnecessary billing
    - Use async/await for all operations as they are asynchronous
    - Handle API errors with try/catch blocks
    - Default timeout is 60s; customize with timeout parameter or requestOptions
    - Instance auto-terminates after 1 hour by default
    - For browser operations, always start browser before browserTool usage
    - Prefer bash commands over GUI interactions for launching applications
    ```
  </Tab>
</Tabs>

## llms-full.txt

Need more context? Check out [llms-full.txt](/llms-full.txt).
