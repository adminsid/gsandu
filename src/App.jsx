import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, Search, Menu, X, ChevronRight, BookOpen, Building2, Stethoscope, Scale, HardHat, Banknote, MapPin, Sparkles, Share2, Phone, Mail, Bookmark, UserCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Auth Utilities --- //
const getAuthToken = () => localStorage.getItem('payload_token');
const setAuthToken = (token) => localStorage.setItem('payload_token', token);
const removeAuthToken = () => localStorage.removeItem('payload_token');
const getAuthUser = () => JSON.parse(localStorage.getItem('payload_user') || 'null');
const setAuthUser = (user) => localStorage.setItem('payload_user', JSON.stringify(user));
const removeAuthUser = () => localStorage.removeItem('payload_user');

// --- Shared Components --- //

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Events', path: '/events' },
  ];

  const user = getAuthUser();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo-container">
          {/* Replicating the circle icon from the logo */}
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <div className="cursor-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
              </svg>
            </div>
          </div>
          <div className="logo-text">
            <span className="logo-title">GS & U Management LLC</span>
            <span className="logo-subtitle">Exceeding Your Networking Needs</span>
          </div>
        </Link>
        
        {/* Desktop Nav */}
        <ul className="nav-menu">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link 
                to={link.path} 
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li>
            <div id="google_translate_element" className="translate-widget" style={{marginTop: '4px'}}></div>
          </li>
          <li>
            {user ? (
              <Link to="/network" className="btn-primary" style={{padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem'}}>
                <UserCircle size={16} /> My Network
              </Link>
            ) : (
              <button className="btn-secondary" style={{padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem'}} onClick={() => window.dispatchEvent(new Event('openAuth'))}>
                <UserCircle size={16} /> Login
              </button>
            )}
          </li>
        </ul>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path} 
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mobile-link" style={{paddingTop: '8px', paddingBottom: '8px'}}>
               <div id="google_translate_element_mobile" className="translate-widget"></div>
               {/* As Google Translate binds to an ID, we only mount it once in the desktop nav usually. To handle mobile, we can rely on the desktop one shrinking or we just use CSS to position it nicely for both. For now, we will leave the element off the mobile dropdown to avoid ID conflicts, relying on CSS. */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>GS & U Community</h3>
          <p>Helping people in many ways.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/directory">Smart Directory</Link>
          <Link to="/jobs">Jobs Board</Link>
          <Link to="/events">Events</Link>
        </div>
        <div className="footer-contact">
          <h4>Connect With Us</h4>
          <p>Email: gsu.mgt@gmail.com</p>
          <p>Location: New York City, NY</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GS & U Management LLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

// --- Pages --- //

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fallback dummy news if API fails
        const dummyNews = [
           { id: 1, title: 'Smart Directory Launched', content: 'We are thrilled to launch the new NYC smart directory for GS&U.', author: 'Admin', published_at: new Date().toISOString() }
        ];
        const res = await fetch('https://my-app.lama-4db.workers.dev/api/news');
        if (res.ok) {
          const data = await res.json();
          setNews(data.docs?.length > 0 ? data.docs : dummyNews);
        } else {
          setNews(dummyNews);
        }
      } catch (err) {
        // use dummy on fail
        setNews([{ id: 1, title: 'Smart Directory Launched', content: 'We are thrilled to launch the new NYC smart directory for GS&U.', author: 'Admin', published_at: new Date().toISOString() }]);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="page homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your NYC <span className="highlight">Resource Hub</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            We connect you to the local businesses, opportunities, and essential government resources you need. Rooted in the philosophy of gaas, baas, kapaas (food, shelter, clothing).
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-actions"
          >
            <Link to="/directory" className="btn-primary large">
              Explore The Network <ChevronRight size={20} />
            </Link>
            <a href="#resources" className="btn-secondary large">Essential Resources</a>
          </motion.div>
        </div>
        <div className="hero-visual">
          {/* Abstract representation of networking/connections */}
          <div className="glow-orb primary-orb"></div>
          <div className="glow-orb secondary-orb"></div>
          <div className="glass-card main-card">
            <Building2 size={48} className="card-icon" />
            <h3>Building Companies</h3>
            <p>From employment to Prime America Real Estate.</p>
          </div>
          <div className="glass-card float-card-1">
            <Users size={32} className="card-icon" />
            <p>Community First</p>
          </div>
        </div>
      </section>

      {/* Community News Section */}
      <section className="news-section">
        <div className="section-header">
          <h2>Community Updates</h2>
          <p>The latest news and resources for the NYC community.</p>
        </div>
        <div className="news-grid">
          {loading ? (
             <div className="loading">Loading updates...</div>
          ) : news.length > 0 ? (
             news.map(item => (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 key={item.id} 
                 className="news-card glass-card"
               >
                 <span className="news-date">{new Date(item.published_at).toLocaleDateString()}</span>
                 <h3>{item.title}</h3>
                 <p>{item.content}</p>
                 {item.author && <span className="news-author">By {item.author}</span>}
               </motion.div>
             ))
          ) : (
             <p className="no-results">No recent updates.</p>
          )}
        </div>
      </section>

      {/* Essential NYC Resources Section (Replaces History) */}
      <section id="resources" className="history-section" style={{paddingTop: '40px'}}>
        <div className="section-header">
          <h2>Essential NYC Resources</h2>
          <p>Direct links to the city services and portals that matter most.</p>
        </div>
        
        <div className="results-grid">
          <a href="https://portal.311.nyc.gov/" target="_blank" rel="noreferrer" className="result-card glass-card" style={{borderLeft: '4px solid var(--accent)'}}>
            <h3>NYC 311</h3>
            <span className="category-tag">City Services</span>
            <p>Report issues, find services, and get information about New York City government.</p>
          </a>
          <a href="https://housingconnect.nyc.gov/PublicWeb/" target="_blank" rel="noreferrer" className="result-card glass-card" style={{borderLeft: '4px solid var(--accent)'}}>
            <h3>Housing Connect</h3>
            <span className="category-tag">Shelter</span>
            <p>Find and apply for affordable housing opportunities across the five boroughs.</p>
          </a>
          <a href="https://www.nyc.gov/site/sbs/index.page" target="_blank" rel="noreferrer" className="result-card glass-card" style={{borderLeft: '4px solid var(--accent)'}}>
            <h3>Small Business Services</h3>
            <span className="category-tag">Business</span>
            <p>Unlock your business potential with NYC SBS resources, grants, and guidance.</p>
          </a>
          <a href="https://www.nyc.gov/site/immigrants/index.page" target="_blank" rel="noreferrer" className="result-card glass-card" style={{borderLeft: '4px solid var(--accent)'}}>
            <h3>Mayor's Office of Immigrant Affairs</h3>
            <span className="category-tag">Community</span>
            <p>Legal assistance, language services, and support programs for immigrant New Yorkers.</p>
          </a>
        </div>
      </section>
    </div>
  );
};

// --- New Features --- //
const AdvertiseModal = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting request...');
    const formData = new FormData(e.target);
    // Append the web3forms access key as requested by the user
    formData.append('access_key', '4309e9db-e44a-423b-9e1f-19b6a5f666a3');
    formData.append('subject', 'New Sponsorship/Featured Ad Request');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        setStatus('Request sent successfully! Our team will contact you shortly regarding billing.');
        setTimeout(() => { setStatus(''); onClose(); }, 4000);
      } else {
        setStatus('There was an error sending your request. Please email us directly.');
      }
    } catch {
      setStatus('There was an error sending your request.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex: 9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} onClick={e => e.stopPropagation()} className="glass-card" style={{width: '90%', maxWidth: '500px', background:'white'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom: '24px'}}>
          <h3><Sparkles size={20} style={{marginRight: '8px', color: 'var(--accent)', verticalAlign: 'middle'}}/> Promote Your Business</h3>
          <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><X/></button>
        </div>
        <p style={{marginBottom: '24px', color:'var(--text-muted)'}}>Stand out from the crowd! Featured ads are pinned to the top of our search results and highlighted with premium styling. Fill out this form and our team will be in touch with billing details.</p>
        
        <form onSubmit={handleSubmit} className="lead-form" style={{borderTop: 'none', padding: 0, marginTop: 0}}>
          <input type="text" name="name" placeholder="Your Name or Business Name" required />
          <input type="email" name="email" placeholder="Contact Email" required />
          <textarea name="message" placeholder="Tell us which listing you want to sponsor, or what kind of ad you are looking for..." required></textarea>
          <input type="hidden" name="from_name" value="GS&U Platform Lead" />
          <button type="submit" className="btn-primary" style={{marginTop: '16px'}}>Submit Sponsorship Request</button>
          {status && <p style={{marginTop: '12px', fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 500}}>{status}</p>}
        </form>
      </motion.div>
    </div>
  );
};

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Processing...');
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users';
      const res = await fetch(`https://my-app.lama-4db.workers.dev${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        if (!isLogin && data.doc) {
           // Auto login after register
           const loginRes = await fetch(`https://my-app.lama-4db.workers.dev/api/users/login`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ email, password })
           });
           const loginData = await loginRes.json();
           if(loginRes.ok) {
             setAuthToken(loginData.token);
             setAuthUser(loginData.user);
           }
        } else if (data.token) {
           setAuthToken(data.token);
           setAuthUser(data.user);
        }
        
        setStatus('Success!');
        window.dispatchEvent(new Event('userUpdated'));
        setTimeout(() => { setStatus(''); onClose(); }, 1000);
      } else {
        setStatus(data.errors?.[0]?.message || 'Authentication failed.');
      }
    } catch {
      setStatus('Network error. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex: 9999, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} onClick={e => e.stopPropagation()} className="glass-card" style={{width: '90%', maxWidth: '400px', background:'white'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom: '24px'}}>
           <h3>{isLogin ? 'Welcome Back' : 'Join the Network'}</h3>
           <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><X/></button>
        </div>
        <p style={{marginBottom: '24px', color:'var(--text-muted)'}}>
           {isLogin ? 'Login to save contacts and manage your personalized network.' : 'Create an account to build your reliable network of contacts.'}
        </p>

        <form onSubmit={handleSubmit} className="lead-form" style={{borderTop: 'none', padding: 0, marginTop: 0}}>
           <input type="email" name="email" placeholder="Email Address" required />
           <input type="password" name="password" placeholder="Password" required />
           <button type="submit" className="btn-primary" style={{marginTop: '16px', width: '100%'}}>
             {isLogin ? 'Login' : 'Create Account'}
           </button>
           {status && <p style={{marginTop: '12px', fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 500, textAlign: 'center'}}>{status}</p>}
        </form>

        <div style={{marginTop: '24px', textAlign: 'center'}}>
           <button onClick={() => setIsLogin(!isLogin)} style={{background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline'}}>
              {isLogin ? "Don't have an account? Join now" : "Already have an account? Login"}
           </button>
        </div>
      </motion.div>
    </div>
  )
}

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('https://my-app.lama-4db.workers.dev/api/jobs');
        if (res.ok) {
          const data = await res.json();
          // Sort sponsored jobs to the top
          const sorted = data.docs.sort((a,b) => (b.is_sponsored ? 1 : 0) - (a.is_sponsored ? 1 : 0));
          setJobs(sorted);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  return (
    <div className="page directory">
       <div className="directory-header">
        <h1>Community Jobs Board</h1>
        <p>Find your next opportunity within the GS&U network.</p>
      </div>
      <div className="results-grid">
        {loading ? <div className="loading">Loading jobs...</div> : jobs.length > 0 ? jobs.map(job => (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={job.id} className={`result-card glass-card ${job.is_sponsored ? 'sponsored-card' : ''}`}>
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
               <span className="category-tag">{job.type.replace('_',' ')}</span>
               {job.is_sponsored && <span style={{fontSize:'0.75rem', background:'var(--accent)', color:'white', padding:'2px 8px', borderRadius:'12px', fontWeight:600}}>FEATURED</span>}
             </div>
             <h3>{job.title}</h3>
             <p style={{fontWeight:600, color:'var(--primary)', marginBottom:'4px'}}>{job.company}</p>
             <p style={{fontSize:'0.9rem', marginBottom:'16px'}}>{job.location} {job.salary_range ? ` • ${job.salary_range}` : ''}</p>
             <div className="result-links" style={{display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center'}}>
               {job.application_link && (
                 <a href={job.application_link.startsWith('http') ? job.application_link : `https://${job.application_link}`} target="_blank" rel="noreferrer" className="btn-primary" style={{padding: '6px 16px', fontSize: '0.9rem'}}>Apply Now</a>
               )}
               <button className="btn-secondary" style={{padding: '4px 12px', fontSize: '0.85rem', marginLeft: 'auto', border: 'none', display: 'flex', alignItems: 'center', gap: '4px'}} onClick={() => {
                 if(navigator.share) navigator.share({title: job.title, url: window.location.href});
                 else alert(`Share this link: ${window.location.href}`);
               }}>
                 <Share2 size={14} /> Share
               </button>
             </div>
          </motion.div>
        )) : <div className="no-results">No jobs posted right now. Check back later!</div>}
      </div>
    </div>
  )
}

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('https://my-app.lama-4db.workers.dev/api/events');
        if (res.ok) {
          const data = await res.json();
          const sorted = data.docs.sort((a,b) => (b.is_sponsored ? 1 : 0) - (a.is_sponsored ? 1 : 0));
          setEvents(sorted);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="page directory">
       <div className="directory-header">
        <h1>Community Events</h1>
        <p>Upcoming gatherings, workshops, and networking events.</p>
      </div>
      <div className="results-grid">
        {loading ? <div className="loading">Loading events...</div> : events.length > 0 ? events.map(evt => (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={evt.id} className={`result-card glass-card ${evt.is_sponsored ? 'sponsored-card' : ''}`}>
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
               <span className="category-tag">{new Date(evt.date).toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute:'2-digit'})}</span>
               {evt.is_sponsored && <span style={{fontSize:'0.75rem', background:'var(--accent)', color:'white', padding:'2px 8px', borderRadius:'12px', fontWeight:600}}>FEATURED</span>}
             </div>
             <h3>{evt.title}</h3>
             <p style={{fontWeight:500, color:'var(--text-muted)', marginBottom:'16px'}}>{evt.location}</p>
             <div className="result-links" style={{display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center'}}>
               {evt.registration_link && (
                 <a href={evt.registration_link.startsWith('http') ? evt.registration_link : `https://${evt.registration_link}`} target="_blank" rel="noreferrer" className="btn-secondary" style={{padding: '6px 16px', fontSize: '0.9rem'}}>Register</a>
               )}
               <button className="btn-secondary" style={{padding: '4px 12px', fontSize: '0.85rem', marginLeft: 'auto', border: 'none', display: 'flex', alignItems: 'center', gap: '4px'}} onClick={() => {
                 if(navigator.share) navigator.share({title: evt.title, url: window.location.href});
                 else alert(`Share this link: ${window.location.href}`);
               }}>
                 <Share2 size={14} /> Share
               </button>
             </div>
          </motion.div>
        )) : <div className="no-results">No upcoming events scheduled.</div>}
      </div>
    </div>
  )
}

const DirectoryPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // NYC Open Data Resources
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  // Lead Form State
  const [activeFormId, setActiveFormId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  
  // Advertise modal
  const [isAdvertiseModalOpen, setIsAdvertiseModalOpen] = useState(false);

  // Define fallback dummy data in case API is unreachable
  const dummyResults = [
    { id: 1, name: 'GS & U Management LLC', type: 'business', description: 'Exceeding your networking needs.', email: 'gsu.mgt@gmail.com', website: 'gsandu.com', category_name: 'Management' },
    { id: 2, name: 'Prime America Real Estate', type: 'business', description: 'Clearing obstacles from your path to your home.', website: 'primeamericany.com', category_name: 'Real Estate' },
    { id: 3, name: 'Sakinxa', type: 'business', description: 'Outsource platform.', category_name: 'Employment' },
    { id: 4, name: 'Gobinda Lama', type: 'person', description: 'Founder and Principal Broker of Prime America Real Estate.', category_name: 'Real Estate' },
    { id: 5, name: 'Siddhartha Lama', type: 'person', description: 'CEO of GS&U.com & PrimeAmericaNY.com.', category_name: 'Real Estate' }
  ];

  useEffect(() => {
    // Dynamic icons mapping based on category names
    const getIconForCategory = (name) => {
       const lower = name.toLowerCase();
       if (lower.includes('real estate') || lower.includes('housing')) return <Home size={18}/>;
       if (lower.includes('employ') || lower.includes('job')) return <Briefcase size={18}/>;
       if (lower.includes('edu')) return <BookOpen size={18}/>;
       if (lower.includes('legal') || lower.includes('law')) return <Scale size={18}/>;
       if (lower.includes('contractor') || lower.includes('build')) return <HardHat size={18}/>;
       if (lower.includes('health') || lower.includes('medical')) return <Stethoscope size={18}/>;
       if (lower.includes('finance') || lower.includes('money')) return <Banknote size={18}/>;
       return <MapPin size={18}/>;
    };

    const defaultCategories = [
      { id: 1, name: 'Real Estate', icon: <Home size={18}/> },
      { id: 2, name: 'Employment', icon: <Briefcase size={18}/> },
      { id: 3, name: 'Education', icon: <BookOpen size={18}/> },
      { id: 4, name: 'Legal Services', icon: <Scale size={18}/> },
      { id: 5, name: 'Contractors', icon: <HardHat size={18}/> },
      { id: 6, name: 'Healthcare', icon: <Stethoscope size={18}/> },
    ];
    setCategories(defaultCategories);
    
    const fetchResources = async () => {
      try {
        const res = await fetch('https://gsandu-worker.lama-4db.workers.dev/api/resources');
        if (res.ok) {
          const data = await res.json();
          setResources(data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch resources');
      }
      setLoadingResources(false);
    };
    
    fetchResources();
    
    // Attempting to fetch from local worker, with dummy data fallback
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = new URL('https://my-app.lama-4db.workers.dev/api/listings/vector-search');
        if (query) url.searchParams.append('q', query);
        if (category) url.searchParams.append('category', category);
        
        // If there's no query, still fetch the default payload from the server if possible (or let it return all)
        const response = await fetch(url);
        if(response.ok) {
          const data = await response.json();
          // Initialize saved state if user exists
          const user = getAuthUser();
          const mappedDocs = (data.docs || []).map(doc => ({
             ...doc,
             isSaved: user?.saved_contacts?.some(sc => sc === doc.id || sc.id === doc.id) || false
          }));
          setResults(mappedDocs);
          
          if(data.categories && data.categories.length) {
             const mappedCategories = data.categories.map(c => ({
                 ...c,
                 icon: getIconForCategory(c.name)
             }));
             setCategories(mappedCategories);
          }
        } else {
          fallbackSearch();
        }
      } catch (err) {
        fallbackSearch();
      }
      setLoading(false);
    };

    const fallbackSearch = () => {
       const user = getAuthUser();
       const filtered = dummyResults.filter(r => {
         const matchQuery = r.name.toLowerCase().includes(query.toLowerCase()) || (r.description && r.description.toLowerCase().includes(query.toLowerCase()));
         const matchCategory = category ? (r.category_name && r.category_name === category) : true;
         const matchCategoryId = category ? (
            (category === '1' && r.category_name === 'Real Estate') ||
            (category === '2' && r.category_name === 'Employment') ||
            (category === '3' && r.category_name === 'Education')
         ) : true;
         
         return matchQuery && (matchCategory || matchCategoryId);
       }).map(doc => ({
           ...doc,
           isSaved: user?.saved_contacts?.some(sc => sc === doc.id || sc.id === doc.id) || false
       }));
       setResults(filtered);
    }

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, category]);

  const handleLeadSubmit = async (e, listingId) => {
    e.preventDefault();
    setFormStatus('Sending...');
    try {
      const res = await fetch('https://my-app.lama-4db.workers.dev/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sender_name: formData.name, 
          sender_email: formData.email, 
          message: formData.message, 
          listing: listingId 
        })
      });
      if (res.ok) {
        setFormStatus('Sent successfully!');
        setTimeout(() => { setActiveFormId(null); setFormStatus(''); setFormData({name:'', email:'', message:''}); }, 2000);
      } else {
        setFormStatus('Error sending.');
      }
    } catch(err) {
      setFormStatus('Error sending.');
    }
  };

  const handleSaveToNetwork = async (listingId, currentlySaved) => {
    const token = getAuthToken();
    const user = getAuthUser();
    if (!token || !user) {
       window.dispatchEvent(new Event('openAuth'));
       return;
    }
    
    // Optimistic UI update
    setResults(prev => prev.map(r => r.id === listingId ? {...r, isSaved: !currentlySaved} : r));
    
    try {
      // First fetch current user doc to get existing saved contacts
      const meRes = await fetch(`https://my-app.lama-4db.workers.dev/api/users/me`, {
        headers: { 'Authorization': `JWT ${token}` }
      });
      const userData = await meRes.json();
      const currentSaved = userData?.user?.saved_contacts?.map(sc => typeof sc === 'object' ? sc.id : sc) || [];
      
      let newSaved;
      if (currentlySaved) {
         newSaved = currentSaved.filter(id => id !== listingId);
      } else {
         newSaved = [...new Set([...currentSaved, listingId])];
      }
      
      const res = await fetch(`https://my-app.lama-4db.workers.dev/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`
        },
        body: JSON.stringify({ saved_contacts: newSaved })
      });
      
      if(res.ok) {
         const updatedUser = await res.json();
         setAuthUser(updatedUser.doc);
      } else {
         // Revert on fail
         setResults(prev => prev.map(r => r.id === listingId ? {...r, isSaved: currentlySaved} : r));
      }
    } catch {
       // Revert on fail
       setResults(prev => prev.map(r => r.id === listingId ? {...r, isSaved: currentlySaved} : r));
    }
  };

  const handleShare = (listing) => {
    if (navigator.share) {
      navigator.share({
        title: listing.name,
        text: `Check out ${listing.name} on the NYC Community Hub!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert(`Share this link: ${window.location.href}`);
    }
  };

  return (
    <div className="page directory">
      <div className="directory-header">
        <h1>Smart Directory</h1>
        <p>Connecting businesses and people in our community.</p>
        
        <div className="search-bar" style={{marginBottom: '24px'}}>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, category, or keyword..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div style={{display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap'}}>
          <button onClick={() => setIsAdvertiseModalOpen(true)} className="btn-secondary" style={{background: 'linear-gradient(to right, #fbfbfb, #f3f4f6)', border: '1px solid #e5e7eb'}}>
            <span style={{color: 'transparent', background: 'linear-gradient(90deg, #ff8a00, #e52e71)', WebkitBackgroundClip: 'text', display: 'flex', alignItems: 'center', gap: '6px'}}>
              <Sparkles size={16} color="#e52e71" /> Promote Your Business
            </span>
          </button>
        </div>
      </div>
      
      <div className="quick-categories">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            className={`category-card ${category === cat.id.toString() ? 'active' : ''}`}
            onClick={() => setCategory(category === cat.id.toString() ? '' : cat.id.toString())}
          >
            <div className="category-card-icon">{cat.icon}</div>
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      <div className="directory-results">
        {loading ? (
          <div className="loading">Loading results...</div>
        ) : results.length > 0 ? (
          <div className="results-grid">
            {results.map(result => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={result.id} 
                className={`result-card glass-card ${result.is_sponsored ? 'sponsored-card' : ''}`}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div className="result-type-badge">
                    {result.type === 'business' ? <Building2 size={16} /> : <Users size={16} />}
                    <span>{result.type}</span>
                  </div>
                  {result.is_sponsored && <span style={{fontSize:'0.75rem', background:'var(--accent)', color:'white', padding:'4px 10px', borderRadius:'12px', fontWeight:600, letterSpacing: '0.5px'}}>FEATURED</span>}
                </div>
                <h3>{result.name}</h3>
                {result.category_name && <span className="category-tag">{result.category_name}</span>}
                <p>{result.description}</p>
                
                {/* Contact Info Directly Visible */}
                <div style={{marginTop: 'auto', marginBottom: '16px', fontSize: '0.9rem'}}>
                  {result.phone && <p style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px'}}><Phone size={14}/> {result.phone}</p>}
                  {result.email && <p style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px'}}><Mail size={14}/> <a href={`mailto:${result.email}`} className="email-link">{result.email}</a></p>}
                </div>

                <div className="result-links" style={{display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center'}}>
                  {result.website && <a href={`https://${result.website.replace('https://', '')}`} target="_blank" rel="noreferrer" className="website-link">Visit Website</a>}
                  {result.is_sponsored && (
                     <button className="btn-secondary" style={{padding: '4px 12px', fontSize: '0.85rem'}} onClick={() => setActiveFormId(result.id)}>Contact Ad</button>
                  )}
                  <button className="btn-secondary" style={{padding: '4px 12px', fontSize: '0.85rem', marginLeft: 'auto', border: 'none', display: 'flex', alignItems: 'center', gap: '4px'}} onClick={() => handleShare(result)}>
                    <Share2 size={14}/> Share
                  </button>
                  <button className="btn-secondary" style={{padding: '4px 8px', fontSize: '0.85rem', border: 'none', display: 'flex', alignItems: 'center', gap: '4px', color: result.isSaved ? 'var(--accent)' : 'inherit'}} onClick={() => handleSaveToNetwork(result.id, result.isSaved)} title="Save to Network">
                    <Bookmark size={16} fill={result.isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Lead Form */}
                <AnimatePresence>
                  {activeFormId === result.id && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="lead-form"
                      onSubmit={(e) => handleLeadSubmit(e, result.id)}
                    >
                      <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      <input type="email" placeholder="Your Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      <textarea placeholder="Message..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                      <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                        <button type="submit" className="btn-primary" style={{padding: '6px 16px'}}>Send</button>
                        <button type="button" onClick={() => setActiveFormId(null)} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}>Cancel</button>
                        {formStatus && <span style={{fontSize: '0.85rem', color: 'var(--primary)'}}>{formStatus}</span>}
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No results found for your search.</p>
          </div>
        )}
      </div>

      {/* NYC Open Data Resources */}
      <div className="resources-section" style={{marginTop: '80px', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '60px'}}>
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <h2>NYC Community Resources</h2>
          <p style={{color: 'var(--text-muted)'}}>Supporting our mission of gaas, baas, kapaas with free community services.</p>
        </div>
        
        {loadingResources ? (
          <div className="loading">Loading resources from NYC Open Data...</div>
        ) : resources.length > 0 ? (
          <div className="results-grid">
            {resources.map((res, idx) => (
              <div key={idx} className="result-card glass-card" style={{borderLeft: '4px solid var(--accent)'}}>
                <h3>{res.program_name || 'Community Resource'}</h3>
                <span className="category-tag">{res.program_category || 'Food / Shelter'}</span>
                <p>{res.street_address}, {res.city} {res.zip_code}</p>
                <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                  {res.contact_number && <p>Phone: {res.contact_number}</p>}
                  {res.hours_of_operation && <p>Hours: {res.hours_of_operation}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No external resources available right now.</p>
        )}
      </div>

      <AdvertiseModal isOpen={isAdvertiseModalOpen} onClose={() => setIsAdvertiseModalOpen(false)} />
    </div>
  );
};

// --- User Network Dashboard --- //
const NetworkPage = () => {
  const [savedContacts, setSavedContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getAuthUser();
  const token = getAuthToken();

  useEffect(() => {
    if(!user || !token) {
       setLoading(false);
       return;
    }
    
    const fetchNetwork = async () => {
      try {
        const res = await fetch(`https://my-app.lama-4db.workers.dev/api/users/me`, {
          headers: { 'Authorization': `JWT ${token}` }
        });
        if(res.ok) {
           const data = await res.json();
           // In Payload, relationship fields returned from /me usually contain the populated objects if depth allows.
           // However, if depth is low, it might just be IDs.
           // Let's assume it returns populated objects for the UI. If not, we'd need a separate fetch.
           const contacts = data.user?.saved_contacts || [];
           setSavedContacts(contacts);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchNetwork();
  }, [user, token]);

  if (!user) {
     return (
       <div className="page directory" style={{textAlign: 'center', paddingTop: '100px'}}>
         <h2>You must be logged in to view your network.</h2>
         <button className="btn-primary" style={{marginTop: '24px'}} onClick={() => window.dispatchEvent(new Event('openAuth'))}>Login / Join</button>
       </div>
     );
  }

  const handleLogout = () => {
     removeAuthToken();
     removeAuthUser();
     window.dispatchEvent(new Event('userUpdated'));
     window.location.href = '/';
  };

  return (
    <div className="page directory">
      <div className="directory-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <h1>My Network</h1>
          <p>Your curated list of trusted NYC contacts and businesses.</p>
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '8px', border: 'none'}}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="directory-results">
        {loading ? (
           <div className="loading">Loading your network...</div>
        ) : savedContacts.length > 0 ? (
           <div className="results-grid">
             {savedContacts.map(contact => {
                // Determine if it's a listing, job, or event based on fields
                const name = contact.name || contact.title || 'Unknown Contact';
                const desc = contact.description || contact.company || contact.location;
                const link = contact.website || contact.application_link || contact.registration_link;
                
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={contact.id} className="result-card glass-card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div className="result-type-badge">
                        <Bookmark size={16} fill="var(--accent)" color="var(--accent)" />
                        <span>Saved</span>
                      </div>
                    </div>
                    <h3>{name}</h3>
                    {contact.category_name && <span className="category-tag">{contact.category_name}</span>}
                    <p>{desc}</p>
                    
                    <div style={{marginTop: 'auto', marginBottom: '16px', fontSize: '0.9rem'}}>
                      {contact.phone && <p style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px'}}><Phone size={14}/> {contact.phone}</p>}
                      {contact.email && <p style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px'}}><Mail size={14}/> <a href={`mailto:${contact.email}`} className="email-link">{contact.email}</a></p>}
                    </div>

                    <div className="result-links" style={{display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center'}}>
                      {link && <a href={`https://${link.replace('https://', '')}`} target="_blank" rel="noreferrer" className="website-link">Visit Link</a>}
                    </div>
                  </motion.div>
                )
             })}
           </div>
        ) : (
           <div className="no-results" style={{textAlign: 'center', padding: '60px 20px'}}>
             <Bookmark size={48} color="var(--text-muted)" style={{marginBottom: '16px', opacity: 0.5}} />
             <h3>Your network is empty.</h3>
             <p style={{color: 'var(--text-muted)', marginTop: '8px'}}>Head over to the Directory to find businesses and save them here.</p>
             <Link to="/directory" className="btn-primary" style={{marginTop: '24px', display: 'inline-block'}}>Explore Directory</Link>
           </div>
        )}
      </div>
    </div>
  )
}

// --- App Root --- //

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    const handleAuthOpen = () => setAuthOpen(true);
    const handleUserUpdate = () => setForceUpdate(prev => prev + 1);

    window.addEventListener('openAuth', handleAuthOpen);
    window.addEventListener('userUpdated', handleUserUpdate);
    return () => {
      window.removeEventListener('openAuth', handleAuthOpen);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/network" element={<NetworkPage />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    </BrowserRouter>
  );
}

export default App;
