import { ReactNode } from 'react'

export interface Project {
  name: string
  description: string
  technologies: string[]
  icon: ReactNode
}

export interface SocialApp {
  name: string
  icon: ReactNode
  url: string
}

