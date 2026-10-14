// Turns dist-artifact/index.html into a single page fragment for the Artifact tool:
// inline CSS + JS, no <html>/<head>/<body> wrapper (the tool adds its own).
import { readFileSync, writeFileSync } from 'node:fs'

const dir = 'dist-artifact'
let html = readFileSync(`${dir}/index.html`, 'utf8')

const css = html.match(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/)
const js = html.match(/<script type="module"[^>]*src="\.\/(assets\/[^"]+\.js)"[^>]*><\/script>/)
if (!css || !js) throw new Error('Could not find built CSS/JS tags')

const cssText = readFileSync(`${dir}/${css[1]}`, 'utf8')
const jsText = readFileSync(`${dir}/${js[1]}`, 'utf8').replace(/<\/script/gi, '<\/script')

html = html.replace(css[0], '').replace(js[0], '')

const title = '<title>Sattva Homes</title>'
const headInner = html.match(/<head>([\s\S]*?)<\/head>/)[1]
const keep = (headInner.match(/<style>[\s\S]*?<\/style>/g) ?? []).concat(headInner.match(/<script>[\s\S]*?<\/script>/g) ?? [])
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1]

const out = [
  title,
  ...keep.filter((s) => !s.includes('application/ld+json')),
  `<style>${cssText}</style>`,
  body.trim(),
  `<script type="module">${jsText}</script>`,
].join('\n')

writeFileSync(`${dir}/artifact.html`, out)
console.log('artifact.html', (out.length / 1024 / 1024).toFixed(2), 'MB')
