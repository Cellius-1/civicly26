import { logoMarkup } from '@/components/Logo'

export const dynamic = 'force-static'

const STYLESHEET = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<meta name="robots" content="noindex"/>
<title><xsl:value-of select="/rss/channel/title"/></title>
<style>
:root { color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; background: #efece4; color: #12161c; font-family: 'Archivo', 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; }
.bar { background: #0e3b43; color: #ffffff; padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
.seal { width: 30px; height: 30px; flex: none; display: block; }
.seal svg { display: block; }
.bar a { color: #ffffff; text-decoration: none; font-weight: 600; margin-left: auto; font-size: 14px; }
.wrap { max-width: 760px; margin: 0 auto; padding: 20px 16px 56px; }
h1 { font-size: 28px; line-height: 1.15; letter-spacing: -0.03em; margin: 0 0 8px; }
.sub { color: #434a54; margin: 0 0 20px; }
.card { background: #ffffff; border: 1px solid #ddd8cc; border-radius: 12px; padding: 16px; margin-bottom: 20px; box-shadow: 0 1px 2px rgba(18,22,28,0.06); }
.card h2 { font-size: 17px; margin: 0 0 6px; }
.card p { margin: 0 0 12px; font-size: 14px; color: #434a54; }
.row { display: flex; gap: 8px; flex-wrap: wrap; }
input { flex: 1; min-width: 220px; min-height: 44px; padding: 0 12px; border: 1px solid #c4bdad; border-radius: 8px; font-family: 'IBM Plex Mono', 'Courier New', monospace; font-size: 13px; background: #efece4; color: #12161c; }
button { min-height: 44px; padding: 0 18px; border: 0; border-radius: 8px; background: #0e3b43; color: #ffffff; font-size: 15px; font-weight: 600; cursor: pointer; }
button:active { transform: scale(0.97); }
ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
li { background: #ffffff; border: 1px solid #ddd8cc; border-radius: 12px; padding: 14px 16px; box-shadow: 0 1px 2px rgba(18,22,28,0.06); }
li a { color: #12161c; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: -0.01em; }
li a:hover { color: #0e3b43; text-decoration: underline; }
li p { margin: 4px 0 0; font-size: 14px; color: #434a54; }
.date { display: block; margin-top: 6px; font-family: 'IBM Plex Mono', 'Courier New', monospace; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: #6d7580; }
.label { font-family: 'IBM Plex Mono', 'Courier New', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6d7580; margin: 0 0 12px; }
</style>
</head>
<body>
<div class="bar">
<span class="seal">${logoMarkup(30, 'brass')}</span>
<strong>Civicly</strong>
<a href="/">Open the app</a>
</div>
<div class="wrap">
<p class="label">Subscription feed</p>
<h1><xsl:value-of select="/rss/channel/title"/></h1>
<p class="sub"><xsl:value-of select="/rss/channel/description"/></p>

<div class="card">
<h2>This page is a feed, not an article</h2>
<p>Paste this address into a news reader such as Feedly, NetNewsWire, Inoreader, or Thunderbird. It updates on its own whenever a deadline, vote, meeting, or budget line changes. No account and no email address.</p>
<div class="row">
<input id="feed-url" type="text" readonly="readonly" aria-label="Feed address">
<xsl:attribute name="value"><xsl:value-of select="/rss/channel/atom:link/@href"/></xsl:attribute>
</input>
<button id="copy-btn" type="button" onclick="copyFeed()">Copy address</button>
</div>
</div>

<p class="label">Latest entries</p>
<ol>
<xsl:for-each select="/rss/channel/item">
<li>
<a>
<xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
<xsl:value-of select="title"/>
</a>
<p><xsl:value-of select="description"/></p>
<span class="date"><xsl:value-of select="pubDate"/></span>
</li>
</xsl:for-each>
</ol>
</div>
<script>
function copyFeed() {
  var field = document.getElementById('feed-url');
  if (!field.value) { field.value = window.location.href; }
  field.select();
  try { navigator.clipboard.writeText(field.value); } catch (e) { document.execCommand('copy'); }
  document.getElementById('copy-btn').textContent = 'Copied';
}
document.addEventListener('DOMContentLoaded', function () {
  var field = document.getElementById('feed-url');
  if (field) { if (!field.value) { field.value = window.location.href; } }
});
</script>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
`

export function GET() {
  return new Response(STYLESHEET, {
    headers: { 'Content-Type': 'text/xsl; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
  })
}
