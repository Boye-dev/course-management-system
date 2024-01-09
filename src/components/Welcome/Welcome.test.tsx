import { render } from '@test-utils';
import { Welcome } from './Welcome.js';

describe('Welcome component', () => {
  it('renders', () => {
    render(<Welcome />);
  });
});
