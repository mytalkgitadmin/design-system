import type { Preview } from '@storybook/react-vite';
import '../src/styles/globals.css';

import { ThemeProvider } from '../src/theme';
import { defaultTheme } from '../src/theme';
import { brandATheme } from '../src/theme/brands/brandA';
import { brandBTheme } from '../src/theme/brands/brandB';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  globalTypes: {
    theme: {
      description: 'Project Theme',
      defaultValue: 'default',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default', icon: 'circle' },
          {
            value: 'brandA',
            title: 'Brand A',
            icon: 'circlehollow',
          },
          { value: 'brandB', title: 'Brand B', icon: 'circle' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const selectedTheme = context.globals.theme;

      let theme;
      switch (selectedTheme) {
        case 'brandA':
          theme = brandATheme;
          break;
        case 'brandB':
          theme = brandBTheme;
          break;
        default:
          theme = defaultTheme;
      }

      return (
        <ThemeProvider theme={theme}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
