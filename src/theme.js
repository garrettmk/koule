export const darkTheme = {
  colors: {
    background: '#1F1F1F',
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.65)',
    },
    divider: 'rgba(255, 255, 255, 0.10)',
    orange: 'orange',
    blue: 'blue',
    gray: 'gray',
  },
  fonts: {
    title: '1.5rem "Arvo", serif',
    subtitle: '1.125rem "Arvo", serif',
    body: '1rem 1 "Noto Sans", sans-serif',
    caption: '0.75rem 1 "Noto Sans", sans-serif'
  },
  sizing: {
    units: number => `${number * 8}px`,
    header: '72px',
    icons: {
      big: '64px',
      regular: '24px',
      small: '16px'
    }
  },
  springs: {
    quick: {
      mass: 1,
      tension: 500,
      friction: 26,
      clamp: true,
    }
  }
};

export const lightTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    text: {
      primary: '#1F1F1F',
      secondary: 'rgba(0, 0, 0, .65)'
    }
  }
};

export default darkTheme;