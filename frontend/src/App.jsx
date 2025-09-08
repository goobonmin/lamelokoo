import React, { useState, useRef } from 'react';
import './App.css';
import ds from "./image/ds.png"
import logo from "./image/logo.png"
import go from "./image/go.png"
import g from "./image/g.png"
import q from "./image/q.png"
import f from "./image/f.png"

const App = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeNav, setActiveNav] = useState('home');
  const [enlargedImage, setEnlargedImage] = useState(null);
  // New state for posts
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const homeRef = useRef(null);
  const destinationsRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const boardRef = useRef(null);

  const destinations = [
    {
      id: 'parisModal',
      title: 'Paris',
      desc: 'Explore the romantic streets and iconic landmarks of the City of Light.',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop',
      modalTitle: 'Paris Details',
      modalDesc: 'Paris, known as the City of Light, offers iconic sights like the Eiffel Tower, Louvre Museum, and Seine River cruises. Don\'t miss the charming cafes and world-class cuisine.'
    },
    {
      id: 'romeModal',
      title: 'Rome',
      desc: 'Step back in time with ancient ruins and vibrant culture.',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1994&auto=format&fit=crop',
      modalTitle: 'Rome Details',
      modalDesc: 'Rome\'s eternal charm includes the Colosseum, Vatican City, and delicious pasta. Explore hidden gems in the Trastevere neighborhood.'
    },
    {
      id: 'barcelonaModal',
      title: 'Barcelona',
      desc: 'Experience the colorful architecture and lively beaches.',
      image: go,
      modalTitle: 'Barcelona Details',
      modalDesc: 'Barcelona boasts Gaudí\'s masterpieces like Sagrada Família and Park Güell, along with vibrant beaches and tapas bars.'
    },
    {
      id: 'londonModal',
      title: '',
      desc: '',
      image: q,
      modalTitle: 'London Details',
      modalDesc: 'London features Big Ben, Buckingham Palace, and diverse neighborhoods. Enjoy afternoon tea and West End shows.'
    },
    {
      id: 'berlinModal',
      title: '',
      desc: '',
      image: g,
      modalTitle: 'Berlin Details',
      modalDesc: 'Berlin\'s history shines at the Berlin Wall and Brandenburg Gate, with a thriving arts scene and beer gardens.'
    },
    {
      id: 'athensModal',
      title: '',
      desc: '',
      image: f,
      modalTitle: 'Athens Details',
      modalDesc: 'Athens is home to the Acropolis and Parthenon, with lively plazas and authentic Greek souvlaki.'
    }
  ];

  const scrollToSection = (ref, id) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveNav(id);
    }
  };

  const openModal = (id) => {
    setActiveModal(id);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const enlargeImage = (image) => {
    setEnlargedImage(image);
  };

  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  // New functions for handling posts
  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      setPosts((prev) => [
        ...prev,
        { id: Date.now(), title: newPost.title, content: newPost.content, date: new Date().toLocaleString() }
      ]);
      setNewPost({ title: '', content: '' });
    }
  };

  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <div>
      <header>
        <img src={logo} alt="Travel Vista Logo" className="logo" style={{ borderRadius: '10px' }} />
        <nav>
          <a className={activeNav === 'home' ? 'active' : ''} onClick={() => scrollToSection(homeRef, 'home')}>Home</a>
          <a className={activeNav === 'destinations' ? 'active' : ''} onClick={() => scrollToSection(destinationsRef, 'destinations')}>Destinations</a>
          <a className={activeNav === 'about' ? 'active' : ''} onClick={() => scrollToSection(aboutRef, 'about')}>About</a>
          <a className={activeNav === 'contact' ? 'active' : ''} onClick={() => scrollToSection(contactRef, 'contact')}>Contact</a>
          <a className={activeNav === 'board' ? 'active' : ''} onClick={() => scrollToSection(boardRef, 'board')}>Board</a>
        </nav>
      </header>
      <section className="hero" ref={homeRef}>
        <h2>Discover Your Next Adventure</h2>
      </section>
      <section className="destinations" ref={destinationsRef}>
        {destinations.map((dest) => (
          <div key={dest.id} className="destination-card">
            <img src={dest.image} alt={dest.title} onClick={() => { openModal(dest.id); enlargeImage(dest.image); }} />
            <h3>{dest.title}</h3>
            <p>{dest.desc}</p>
          </div>
        ))}
      </section>
      {destinations.map((dest) => (
        activeModal === dest.id && (
          <div key={dest.id} className="modal" style={{ display: 'block' }} onClick={(e) => { if (e.target.className === 'modal') closeModal(); }}>
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{dest.modalTitle}</h2>
              <p>{dest.modalDesc}</p>
            </div>
          </div>
        )
      ))}
      <section id="about" ref={aboutRef}>
        <h2 style={{ textAlign: 'center', padding: '2rem', fontFamily: "'Montserrat', sans-serif", color: '#1a3c5e' }}>About Us</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem 2rem', color: '#555' }}>Travel Vista is your guide to unforgettable adventures, offering inspiration and tips for exploring the world’s most beautiful destinations.</p>
      </section>
      <section id="contact" ref={contactRef}>
        <h2 style={{ textAlign: 'center', padding: '2rem', fontFamily: "'Montserrat', sans-serif", color: '#1a3c5e' }}>Contact Us</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem 2rem', color: '#555' }}>Get in touch at info@travelvista.com for travel inquiries or collaborations.</p>
      </section>
      <section id="board" ref={boardRef} style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', padding: '2rem', fontFamily: "'Montserrat', sans-serif", color: '#1a3c5e' }}>Travel Discussion Board</h2>
        <div className="post-form" style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            name="title"
            value={newPost.title}
            onChange={handlePostChange}
            placeholder="Post Title"
            className="w-full p-2 mb-2 border rounded"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          />
          <textarea
            name="content"
            value={newPost.content}
            onChange={handlePostChange}
            placeholder="Share your travel experience..."
            className="w-full p-2 mb-2 border rounded"
            rows="4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          ></textarea>
          <button
            onClick={handlePostSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Submit Post
          </button>
        </div>
        <div className="posts-list">
          {posts.length === 0 ? (
            <p style={{ color: '#555', textAlign: 'center' }}>No posts yet. Be the first to share!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post" style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", color: '#1a3c5e' }}>{post.title}</h3>
                <p style={{ color: '#555' }}>{post.content}</p>
                <p style={{ color: '#777', fontSize: '0.9rem' }}>Posted on: {post.date}</p>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>
      <footer>
        <p>&copy; 2025 Travel Vista. All rights reserved.</p>
      </footer>
      {enlargedImage && (
        <div className="enlarged-image" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={closeEnlargedImage}>
          <img src={enlargedImage} alt="Enlarged" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '10px' }} />
          <span className="close" style={{ position: 'absolute', top: '20px', right: '20px', color: '#fff', fontSize: '30px', cursor: 'pointer' }} onClick={closeEnlargedImage}>&times;</span>
        </div>
      )}
    </div>
  );
};

export default App;