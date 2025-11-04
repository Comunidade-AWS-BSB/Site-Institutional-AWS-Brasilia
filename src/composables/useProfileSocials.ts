import { Linkedin, Instagram, Github, Newspaper, Globe } from 'lucide-vue-next'

export type MediaName = 'LINKEDIN' | 'INSTAGRAM' | 'GITHUB' | 'MEDIUM' | 'OTHER'

export function iconForMedia(name: MediaName) {
  switch (name) {
    case 'LINKEDIN': return Linkedin
    case 'INSTAGRAM': return Instagram
    case 'GITHUB': return Github
    case 'MEDIUM': return Newspaper
    default: return Globe
  }
}

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url)
    return u.toString()
  } catch {
    return url.startsWith('http') ? url : `https://${url}`
  }
}

