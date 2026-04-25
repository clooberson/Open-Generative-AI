import AgentCreateClient from "./AgentCreateClient";

/**
 * Server component for the agent creation page.
 * Renders the client-side agent creation form.
 */
export const metadata = {
  title: "Create Agent | Open Generative AI",
  description: "Create a new AI agent with custom instructions and capabilities",
};

export default function AgentCreatePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6">
      <div className="w-full max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Agent</h1>
          <p className="mt-2 text-sm text-gray-500">
            Configure your AI agent with a name, description, and custom system
            instructions to shape its behavior. Tip: the more specific your
            instructions, the better the agent will perform.
          </p>
        </div>
        <AgentCreateClient />
      </div>
    </main>
  );
}
