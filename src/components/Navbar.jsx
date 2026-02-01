import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-5 backdrop-blur-xl bg-white/[0.03] border-b-2 border-border sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-11 h-11 bg-gradient-to-br from-primary to-secondary rounded-xl border-[3px] border-white flex items-center justify-center text-xl"
          style={{ boxShadow: '4px 4px 0 white' }}>
          🚀
        </div>
        <span className="font-syne text-2xl font-extrabold gradient-text">
          LingoCode
        </span>
      </Link>

      {/* Navigation Links - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#curriculum">Curriculum</NavLink>
        <NavLink href="#demo">Demo</NavLink>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <Link to="/login" className="hidden sm:block btn-neu btn-secondary text-sm">
          Log In
        </Link>
        <Link to="/signup" className="btn-neu btn-primary text-sm">
          Start Free
        </Link>
      </div>
    </nav>
  )
}

const NavLink = ({ href, children }) => (
  <a 
    href={href}
    className="text-text-muted font-medium hover:text-white transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-[3px] bg-secondary transition-all duration-300 group-hover:w-full" />
  </a>
)

export default Navbar