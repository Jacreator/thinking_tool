export interface MockProject {
  id: string
  name: string
  slug: string
  owned: boolean
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: "1", name: "Auth System Redesign", slug: "auth-system-redesign", owned: true },
  { id: "2", name: "Payment Service", slug: "payment-service", owned: true },
  { id: "3", name: "API Gateway", slug: "api-gateway", owned: false },
  { id: "4", name: "Shared Dashboard", slug: "shared-dashboard", owned: false },
]
