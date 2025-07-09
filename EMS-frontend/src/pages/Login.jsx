import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { login } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  
  // Check for WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.warn('WebGL not supported - using fallback background');
      setWebGLSupported(false);
    }
  }, []);
  
  // Enhanced Three.js Scene Setup with Modern Effects
  useEffect(() => {
    if (!mountRef.current || !webGLSupported) return;

    try {
      // Scene setup with fog for depth
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x1a1a2e, 10, 50);
      
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      
      // Try to create renderer with error handling
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: "default" // Changed from high-performance to default for better compatibility
        });
      } catch (error) {
        console.error('Failed to create WebGL renderer:', error);
        setWebGLSupported(false);
        return;
      }
      
      if (!renderer) {
        setWebGLSupported(false);
        return;
      }
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      mountRef.current.appendChild(renderer.domElement);

      // Create particle system for background stars
      const particleCount = 1000;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 100;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // Create modern geometric shapes with enhanced materials
      const geometries = [
        new THREE.IcosahedronGeometry(1, 1),
        new THREE.OctahedronGeometry(1.2),
        new THREE.TetrahedronGeometry(1.5),
        new THREE.DodecahedronGeometry(0.8),
        new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8),
        new THREE.SphereGeometry(0.8, 32, 32),
      ];

      // Enhanced materials with emissive properties and metalness
      const materials = [
        new THREE.MeshStandardMaterial({ 
          color: 0x3b82f6, 
          transparent: true, 
          opacity: 0.8,
          metalness: 0.7,
          roughness: 0.2,
          emissive: 0x1e40af,
          emissiveIntensity: 0.1
        }),
        new THREE.MeshStandardMaterial({ 
          color: 0x8b5cf6, 
          transparent: true, 
          opacity: 0.8,
          metalness: 0.8,
          roughness: 0.1,
          emissive: 0x6d28d9,
          emissiveIntensity: 0.15
        }),
        new THREE.MeshStandardMaterial({ 
          color: 0x06b6d4, 
          transparent: true, 
          opacity: 0.8,
          metalness: 0.6,
          roughness: 0.3,
          emissive: 0x0891b2,
          emissiveIntensity: 0.1
        }),
        new THREE.MeshStandardMaterial({ 
          color: 0x10b981, 
          transparent: true, 
          opacity: 0.8,
          metalness: 0.5,
          roughness: 0.4,
          emissive: 0x059669,
          emissiveIntensity: 0.12
        }),
        new THREE.MeshStandardMaterial({ 
          color: 0xf59e0b, 
          transparent: true, 
          opacity: 0.8,
          metalness: 0.7,
          roughness: 0.2,
          emissive: 0xd97706,
          emissiveIntensity: 0.1
        }),
        new THREE.MeshStandardMaterial({ 
          color: 0xef4444, 
          transparent: true, 
          opacity: 0.8,
          metalness: 0.6,
          roughness: 0.3,
          emissive: 0xdc2626,
          emissiveIntensity: 0.1
        }),
      ];

      const meshes = [];
      const originalPositions = [];
      
      // Create floating objects with physics-like properties
      for (let i = 0; i < 25; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        // Enhanced positioning in 3D space
        const radius = 15 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
        mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
        mesh.position.z = radius * Math.cos(phi);
        
        // Store original positions for wave motion
        originalPositions.push({
          x: mesh.position.x,
          y: mesh.position.y,
          z: mesh.position.z
        });
        
        mesh.rotation.x = Math.random() * Math.PI * 2;
        mesh.rotation.y = Math.random() * Math.PI * 2;
        mesh.rotation.z = Math.random() * Math.PI * 2;
        
        // Add random scale variation
        const scale = 0.5 + Math.random() * 1.5;
        mesh.scale.setScalar(scale);
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        scene.add(mesh);
        meshes.push(mesh);
      }

      // Enhanced lighting setup
      const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
      scene.add(ambientLight);
      
      // Main directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(20, 20, 10);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);
      
      // Point lights for dynamic lighting
      const pointLight1 = new THREE.PointLight(0x3b82f6, 0.5, 30);
      pointLight1.position.set(-15, 10, 5);
      scene.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.5, 30);
      pointLight2.position.set(15, -10, -5);
      scene.add(pointLight2);
      
      const pointLight3 = new THREE.PointLight(0x06b6d4, 0.3, 25);
      pointLight3.position.set(0, 15, 10);
      scene.add(pointLight3);

      camera.position.set(0, 0, 25);
      camera.lookAt(0, 0, 0);
      
      sceneRef.current = { scene, camera, renderer, meshes, particles, originalPositions, pointLight1, pointLight2, pointLight3 };

      // Enhanced animation loop with mouse interaction
      let mouseX = 0;
      let mouseY = 0;
      
      const handleMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      
      window.addEventListener('mousemove', handleMouseMove);

      const animate = () => {
        if (!mountRef.current) return; // Check if component is still mounted
        
        requestAnimationFrame(animate);
        
        const time = Date.now() * 0.001;
        
        // Camera movement based on mouse position
        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        
        // Animate particles rotation
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
        
        // Enhanced object animations
        meshes.forEach((mesh, index) => {
          // Complex rotation patterns
          mesh.rotation.x += 0.003 + Math.sin(time + index) * 0.002;
          mesh.rotation.y += 0.005 + Math.cos(time + index) * 0.002;
          mesh.rotation.z += 0.002 + Math.sin(time * 0.5 + index) * 0.001;
          
          // Wave motion based on original positions
          const original = originalPositions[index];
          mesh.position.x = original.x + Math.sin(time + index * 0.5) * 2;
          mesh.position.y = original.y + Math.cos(time * 0.8 + index * 0.3) * 1.5;
          mesh.position.z = original.z + Math.sin(time * 0.6 + index * 0.7) * 1;
          
          // Pulsing scale effect
          const pulseFactor = 1 + Math.sin(time * 2 + index) * 0.1;
          mesh.scale.setScalar((0.5 + Math.random() * 1.5) * pulseFactor);
          
          // Dynamic opacity
          mesh.material.opacity = 0.6 + Math.sin(time + index) * 0.2;
        });
        
        // Animate point lights
        pointLight1.position.x = Math.sin(time * 0.5) * 20;
        pointLight1.position.z = Math.cos(time * 0.5) * 15;
        
        pointLight2.position.x = Math.cos(time * 0.7) * 18;
        pointLight2.position.y = Math.sin(time * 0.7) * 12;
        
        pointLight3.position.y = Math.sin(time * 0.3) * 20;
        pointLight3.position.z = Math.cos(time * 0.3) * 10;
        
        renderer.render(scene, camera);
      };
      
      animate();

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };
      
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (mountRef.current && renderer.domElement) {
          try {
            mountRef.current.removeChild(renderer.domElement);
          } catch (e) {
            console.warn('Error while cleaning up WebGL renderer:', e);
          }
        }
        
        // Dispose of geometries and materials
        meshes.forEach(mesh => {
          mesh.geometry.dispose();
          mesh.material.dispose();
        });
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
      };
    } catch (error) {
      console.error('Error initializing Three.js scene:', error);
      setWebGLSupported(false);
    }
  }, [webGLSupported]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await login(email, password);
        if (response.success) {
        // Store user info in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', response.user.role.toLowerCase());
        localStorage.setItem('userId', response.user.eid);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('userFullName', response.user.fullName);
        
        // Navigate based on user role
        const userRole = response.user.role.toLowerCase();
        if (userRole === 'employee') {
          navigate('/employee-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 404) {
          errorMessage = 'User not found';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      {webGLSupported ? (
        /* Enhanced Three.js Background */
        <div 
          ref={mountRef} 
          className="absolute inset-0 -z-10"
          style={{ 
            background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
          }}
        />
      ) : (
        /* Fallback CSS Background */
        <div 
          className="absolute inset-0 -z-10"
          style={{ 
            background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Add some CSS-based stars/effects for non-WebGL browsers */}
          <div className="stars-container">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${5 + Math.random() * 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.7 + 0.3,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Dynamic overlay with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20 -z-5 animate-gradient-shift opacity-60" />
      
      {/* Floating particles overlay */}
      <div className="absolute inset-0 -z-5">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
      </div>
      
      {/* Login Form with enhanced animations */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Company Logo/Title with sophisticated fade-in animation */}
          <div className="text-center mb-8 animate-fade-in-up animation-delay-200">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              Employee Management System
            </h1>
            <p className="text-white/90 text-lg md:text-xl drop-shadow-lg font-light tracking-wide animate-fade-in-up animation-delay-400">
              Engenia Solutions
            </p>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full animate-glow"></div>
          </div>
          
          {/* Enhanced Login Card with advanced glassmorphism */}
          <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-glow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-glow-lg hover:bg-white/10 animate-slide-up group">
            {/* Animated background pattern with multiple gradients */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 animate-gradient-shift opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded-3xl shadow-inner-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent animate-fade-in-up animation-delay-600">
                  Welcome Back
                </h2>
                <p className="text-white/80 text-lg font-light animate-fade-in-up animation-delay-800">Please sign in to your account</p>
                
                {/* Decorative elements */}
                <div className="flex justify-center mt-4 space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-1000"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-1200"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-1400"></div>
                </div>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-8">
                {error && (
                  <div className="p-4 text-sm text-red-100 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm animate-shake shadow-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3 animate-pulse"></div>
                      {error}
                    </div>
                  </div>
                )}
                
                {/* Email input with enhanced styling */}
                <div className="space-y-3 group/email">
                  <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2 transition-all duration-300 group-focus-within/email:text-blue-300 group-focus-within/email:translate-x-1">
                    <span className="flex items-center">
                      <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-2 opacity-0 group-focus-within/email:opacity-100 transition-opacity duration-300"></div>
                      Email Address
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 focus:bg-white/10 transform focus:scale-105 hover:shadow-glow focus:shadow-glow-lg"
                      placeholder="Enter your email"
                    />
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-cyan-500/0 group-focus-within/email:from-blue-500/20 group-focus-within/email:via-purple-500/10 group-focus-within/email:to-cyan-500/20 transition-all duration-500 pointer-events-none -z-10 blur-sm"></div>
                  </div>
                </div>
                
                {/* Password input with enhanced styling */}
                <div className="space-y-3 group/password">
                  <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2 transition-all duration-300 group-focus-within/password:text-purple-300 group-focus-within/password:translate-x-1">
                    <span className="flex items-center">
                      <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-cyan-400 rounded-full mr-2 opacity-0 group-focus-within/password:opacity-100 transition-opacity duration-300"></div>
                      Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-500 hover:bg-white/10 focus:bg-white/10 transform focus:scale-105 hover:shadow-glow focus:shadow-glow-lg"
                      placeholder="Enter your password"
                    />
                    {/* Animated border gradient */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-cyan-500/0 group-focus-within/password:from-purple-500/20 group-focus-within/password:via-blue-500/10 group-focus-within/password:to-cyan-500/20 transition-all duration-500 pointer-events-none -z-10 blur-sm"></div>
                  </div>
                </div>
                
                {/* Enhanced submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 font-semibold text-white transition-all duration-500 rounded-xl backdrop-blur-sm border border-white/20 relative overflow-hidden group/button transform hover:scale-105 active:scale-95
                  ${loading 
                    ? 'bg-gray-500/20 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:via-purple-600/50 hover:to-cyan-600/50 hover:shadow-glow-lg hover:border-white/40'
                  } 
                  focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:shadow-glow-lg`}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 opacity-0 group-hover/button:opacity-20 transition-all duration-500 animate-gradient-x"></div>
                  
                  {/* Ripple effect layers */}
                  <div className="absolute inset-0 rounded-xl bg-white/5 transform scale-0 group-active/button:scale-100 transition-transform duration-150"></div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 transform scale-0 group-hover/button:scale-100 transition-transform duration-300"></div>
                  
                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                        <span className="animate-pulse">Signing in...</span>
                      </>
                    ) : (
                      <span className="text-lg font-medium bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                        Sign In
                      </span>
                    )}
                  </div>                </button>
              </form>
            </div>
          </div>
          
          {/* Additional floating elements */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-float animation-delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
