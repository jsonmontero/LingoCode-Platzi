const Background = () => {
  return (
    <>
      {/* Gradient Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(6, 214, 160, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 60%),
            #0D0D1A
          `
        }}
      />
      
      {/* Floating Orbs */}
      <div 
        className="fixed -top-24 -right-24 w-96 h-96 rounded-full animate-float -z-10"
        style={{ 
          background: 'rgba(139, 92, 246, 0.5)',
          filter: 'blur(80px)'
        }}
      />
      <div 
        className="fixed -bottom-12 -left-12 w-72 h-72 rounded-full animate-float-delay-1 -z-10"
        style={{ 
          background: 'rgba(6, 214, 160, 0.5)',
          filter: 'blur(80px)'
        }}
      />
      <div 
        className="fixed top-1/2 left-1/2 w-48 h-48 rounded-full animate-float-delay-2 -z-10"
        style={{ 
          background: 'rgba(255, 107, 107, 0.4)',
          filter: 'blur(80px)'
        }}
      />
    </>
  )
}

export default Background