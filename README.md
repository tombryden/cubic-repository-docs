# Cubic Repository Docs

## Tech Stack

- **Next.js 16** - Full-stack React framework with App Router
- **React 19** - Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Supabase** - PostgreSQL database (chosen to align with Cubic's stack)
- **Prisma 6** - Type-safe ORM
- **TanStack Query** - Server state management
- **Vercel AI SDK** - AI integration
- **OpenAI** - LLM for content generation
- **Octokit** - GitHub REST API client
- **Inngest** - Workflow orchestration and event management
- **TSyringe** - Dependency injection container
- **Zod** - Runtime type validation

## Architecture Decisions

### Hexagonal Architecture

The API layer implements **Hexagonal Architecture** (Ports & Adapters pattern) to ensure:

- Clear separation between business logic and external concerns
- Testability through dependency inversion
- Flexibility to swap implementations (e.g., switching databases)
- Scalability for future expansion

**Structure:**

```
src/api/
├── core/              # Domain logic (entities, use cases)
├── infrastructure/
│   ├── adaptors/
│   │   ├── inbound/   # Entry points (API routes, Inngest functions)
│   │   └── outbound/  # External integrations (Prisma, GitHub API)
```

### API Routes Over Direct RSC Database Access

While React Server Components allow direct database queries, this project uses API route handlers to maintain clean architecture boundaries. This approach:

- Preserves hexagonal architecture principles
- Keeps business logic separate from presentation
- Enables easier testing and future refactoring
- Demonstrates scalable architecture patterns

### GitHub API Approach (MVP)

Given the **5-hour time constraint**, the AI uses GitHub's REST API rather than a full RAG (Retrieval-Augmented Generation) system:

**Current Implementation:**

- Fetches file tree and contents via GitHub API
- Passes files directly to LLM for analysis
- Simple, fast to implement, no infrastructure needed

**Why Not RAG:**

- Vercel's 512MB `/tmp` limit prevents `git clone`
- Would need separate infrastructure (AWS Lambda + EFS)
- MVP prioritised demonstrating architecture and a complete product over optimisation

**Trade-offs:**

- Less cost-efficient (entire files vs. chunked embeddings)
- GitHub API rate limits (5,000 req/hr)
- Potential context window issues with large files

For production, a RAG system with `git clone`, embeddings, and vector search would be ideal.

---

**Built to demonstrate clean architecture, a complete product and thoughtful engineering decisions within time constraints.**
