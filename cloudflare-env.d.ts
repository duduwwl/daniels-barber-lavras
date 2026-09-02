export {};

declare global {
  namespace Cloudflare {
    interface Env {
      DB: D1Database;
      MANAGER_EMAIL?: string;
    }
  }
}
