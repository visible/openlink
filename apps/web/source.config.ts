import { defineDocs, defineConfig } from "fumadocs-mdx/config"

export const { docs, meta } = defineDocs({
  dir: "content/docs",
})

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "min-light",
        dark: "min-dark",
      },
    },
  },
})
