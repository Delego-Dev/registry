import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// The preview imports the REAL registry sources via the @/components/ui alias —
// what compiles here is exactly what consumers install. cn() comes from the
// local lib. Order matters: the more specific alias must precede @.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: "@/lib/utils", replacement: resolve(__dirname, "src/lib/utils.ts") },
      { find: "@/components/ui", replacement: resolve(__dirname, "../../registry/delego/ui") },
      { find: "@", replacement: resolve(__dirname, "src") },
    ],
  },
})
