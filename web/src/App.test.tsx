import {
  render,
  screen
} from '@testing-library/react';

import App from './App';

// import Chat from './components/Chat';
// import React from 'react';

test('renders connect button', async () => {
  render(<App />);
  const button = screen.getByText(/connect/i);
  expect(button).toBeInTheDocument();
});

// test('renders send MSG button', async () => {
//   render(<App />);
  
//   await waitFor(() => {
//     // const button = screen.getByText(/send MSG/i);
//     const button = screen.getByText(/connect/i);
//     expect(button).toBeInTheDocument();

//   }, {
//     timeout: 2000
//   })

// });
