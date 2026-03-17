export interface SopToolResponse {
  tool: string;
  market_name: string;
  status: "ready" | "blocked" | "error";
  prerequisites_met: boolean;
  blocked_by?: string[];
  upstream_context?: Record<string, string>;
  relevant_learnings?: Array<{
    pattern: string;
    evidence: string;
    confidence: string;
  }>;
  sop_instructions: string;
  agent_instructions?: string;
  output_directory: string;
}

export interface UtilityToolResponse {
  tool: string;
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface BlockedResponse {
  tool: string;
  status: "blocked";
  message: string;
  missing_stages: Array<{
    stage: string;
    current_status: string;
    required_status: string;
  }>;
  fix_instructions: string[];
}
