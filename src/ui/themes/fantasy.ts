export type FantasyTheme = {
  colors: {
    gold: string
    goldDark: string
    panel: string
    panelLight: string
    text: string
    mutedText: string
    glow: string
    hp: string
    exp: string
    special: string
    danger: string
    toast: string
  }
  font: {
    title: string
    body: string
    small: string
  }
  metrics: {
    border: number
    radius: number
    padding: number
    glowBlur: number
  }
}

export const fantasyTheme: FantasyTheme = {
  colors: {
    gold: '#d8b15a',
    goldDark: '#6b4a1f',
    panel: 'rgba(12, 10, 18, 0.78)',
    panelLight: 'rgba(34, 28, 46, 0.72)',
    text: '#fff7d6',
    mutedText: '#c8bfa4',
    glow: 'rgba(255, 222, 128, 0.86)',
    hp: '#d84242',
    exp: '#3c8cff',
    special: '#b65cff',
    danger: '#ff7d54',
    toast: 'rgba(20, 14, 24, 0.9)',
  },
  font: {
    title: 'bold 22px serif',
    body: '16px serif',
    small: '12px serif',
  },
  metrics: {
    border: 3,
    radius: 10,
    padding: 14,
    glowBlur: 12,
  },
}
