import { render, screen } from '@testing-library/react'
import { Navbar } from './Navbar'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'

describe('Navbar Component', () => {
  it('renders Brandtitle correctly', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Pantemonium/i)).toBeInTheDocument()
  })

  it('renders main navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Brands/i)).toBeInTheDocument()
    expect(screen.getByText(/How It Works/i)).toBeInTheDocument()
    expect(screen.getByText(/Scanner/i)).toBeInTheDocument()
  })

  it('shows login button when not authenticated', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/Log in/i)).toBeInTheDocument()
  })
})
