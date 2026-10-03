import Link from "next/link";
import type { ReactNode } from "react";

// Renders the small Markdown subset used by admin-edited pages into React
// elements (never raw HTML), so page text cannot inject scripts.

function safeHref(href: string) {
  return /^(https?:\/\/|mailto:|\/|#)/i.test(href) ? href : null;
}

function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const k = `${key}-${n++}`;
    if (match[1] !== undefined) out.push(<strong key={k}>{inline(match[1], k)}</strong>);
    else if (match[2] !== undefined) out.push(<em key={k}>{inline(match[2], k)}</em>);
    else {
      const href = safeHref(match[4]);
      if (!href) out.push(match[3]);
      else if (href.startsWith("/") || href.startsWith("#"))
        out.push(<Link key={k} href={href}>{match[3]}</Link>);
      else
        out.push(
          <a key={k} href={href} target="_blank" rel="noopener noreferrer nofollow">
            {match[3]}
          </a>,
        );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks: ReactNode[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    const key = `b${i}`;
    if (!line) {
      i++;
    } else if (line.startsWith("### ")) {
      blocks.push(<h3 key={key}>{inline(line.slice(4), key)}</h3>);
      i++;
    } else if (line.startsWith("## ")) {
      blocks.push(<h2 key={key}>{inline(line.slice(3), key)}</h2>);
      i++;
    } else if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const marker = ordered ? /^\d+\. / : /^[-*] /;
      const items: ReactNode[] = [];
      while (i < lines.length && marker.test(lines[i].trim())) {
        items.push(<li key={i}>{inline(lines[i].trim().replace(marker, ""), `${key}-${i}`)}</li>);
        i++;
      }
      blocks.push(ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>);
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(#{2,3} |[-*] |\d+\. )/.test(lines[i].trim())) {
        para.push(lines[i].trim());
        i++;
      }
      blocks.push(<p key={key}>{inline(para.join(" "), key)}</p>);
    }
  }
  return <div className="prose-page">{blocks}</div>;
}
