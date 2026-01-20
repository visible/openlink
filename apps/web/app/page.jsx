import styles from './page.module.css'

const code = `import { preview } from 'openlink'

const data = await preview('https://github.com')

// {
//   url: 'https://github.com',
//   title: 'GitHub',
//   description: 'Where the world builds software',
//   image: 'https://github.githubassets.com/...',
//   favicon: 'https://github.com/favicon.ico',
//   siteName: 'GitHub',
//   domain: 'github.com',
//   type: 'website'
// }`

export default function Page() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>openlink</h1>
        <p className={styles.tagline}>Edge-first link preview. Zero dependencies.</p>
        <div className={styles.buttons}>
          <a href="https://npmjs.com/package/openlink" className={styles.button}>
            npm install openlink
          </a>
          <a href="https://github.com/visible/openlink" className={styles.buttonAlt}>
            GitHub
          </a>
        </div>
      </section>

      <section className={styles.code}>
        <pre><code>{code}</code></pre>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h3>Zero Dependencies</h3>
          <p>No node-fetch. No axios. No cheerio. Just standard web APIs.</p>
        </div>
        <div className={styles.feature}>
          <h3>Edge Native</h3>
          <p>Works in Cloudflare Workers, Vercel Edge, Deno, and Bun.</p>
        </div>
        <div className={styles.feature}>
          <h3>Tiny</h3>
          <p>Under 5kb minified. Copy the file if you want.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>MIT License</p>
      </footer>
    </main>
  )
}
