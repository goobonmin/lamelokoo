import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import logo from "./image/logo.png";
import go from "./image/go.png";
import zxc from "./image/zxc.png";
import qwe from "./image/qwe.png";
import sdfxc from "./image/sdfxc.png";

const Modal = ({ isOpen, onClose, title, desc, onClickOutside }) => {
  if (!isOpen) return null;
  return (
    <div className="modal" onClick={onClickOutside}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{title}</h2>
        <p>{desc}</p>
      </div>
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <h2 className="section-header">{title}</h2>
);

const App = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [activeNav, setActiveNav] = useState('home');
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [trips, setTrips] = useState([]);
  const [newTrip, setNewTrip] = useState({ destination: '', startDate: '', endDate: '', notes: '' });
  const [editingTrip, setEditingTrip] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedSongDestination, setSelectedSongDestination] = useState('');
  const [neonMode, setNeonMode] = useState(() => {
    return localStorage.getItem('neonMode') === 'true';
  });
  const [isFlashing, setIsFlashing] = useState(false);
  const [showLightning, setShowLightning] = useState(false);

  const homeRef = useRef(null);
  const destinationsRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const boardRef = useRef(null);
  const plannerRef = useRef(null);
  const favoritesRef = useRef(null);
  const songsRef = useRef(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    setPosts(savedPosts);
  }, []);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('travelPlans')) || [];
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const savedSongDestination = localStorage.getItem('selectedSongDestination') || '';
    setTrips(savedTrips);
    setFavorites(savedFavorites);
    setSelectedSongDestination(savedSongDestination);
  }, []);

  useEffect(() => {
    localStorage.setItem('travelPlans', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('selectedSongDestination', selectedSongDestination);
  }, [selectedSongDestination]);

  useEffect(() => {
    localStorage.setItem('neonMode', neonMode);
  }, [neonMode]);

  const scrollToSection = (ref, id) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: 'smooth'
      });
      setActiveNav(id);
    }
  };

  const openModal = (id) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  const enlargeImage = (image) => setEnlargedImage(image);
  const closeEnlargedImage = () => setEnlargedImage(null);

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;
    setPosts((prev) => [
      ...prev,
      { id: Date.now(), title: newPost.title, content: newPost.content, date: new Date().toLocaleString() }
    ]);
    setNewPost({ title: '', content: '' });
  };

  const handleDeletePost = (id) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleTripChange = (e) => {
    const { name, value } = e.target;
    setNewTrip((prev) => ({ ...prev, [name]: value }));
  };

  const handleTripSubmit = (e) => {
    e.preventDefault();
    if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate) return;
    if (editingTrip) {
      setTrips((prev) => 
        prev.map((trip) =>
          trip.id === editingTrip.id ? { ...trip, ...newTrip } : trip
        )
      );
      setEditingTrip(null);
    } else {
      setTrips((prev) => [...prev, { id: Date.now(), ...newTrip }]);
    }
    setNewTrip({ destination: '', startDate: '', endDate: '', notes: '' });
  };

  const handleEditTrip = (trip) => {
    setNewTrip(trip);
    setEditingTrip(trip);
  };

  const handleDeleteTrip = (id) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  const toggleFavorite = (destTitle) => {
    setFavorites((prev) =>
      prev.includes(destTitle)
        ? prev.filter((title) => title !== destTitle)
        : [...prev, destTitle]
    );
  };

  const toggleNeonMode = () => {
    setNeonMode((prev) => !prev);
  };

  const getFavoriteDestinations = () => 
    destinations.filter((dest) => favorites.includes(dest.title));

  const handleSongDestinationChange = (e) => {
    setSelectedSongDestination(e.target.value);
  };

  const handleLogoClick = () => {
    setIsFlashing(true);
  };

  const handleLogoDoubleClick = () => {
    setShowLightning(true);
  };

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
      title: 'London',
      desc: 'Discover historic landmarks and vibrant culture.',
      image: zxc,
      modalTitle: 'London Details',
      modalDesc: 'London features Big Ben, Buckingham Palace, and diverse neighborhoods. Enjoy afternoon tea and West End shows.'
    },
    {
      id: 'berlinModal',
      title: 'Berlin',
      desc: 'Experience rich history and a thriving arts scene.',
      image: qwe,
      modalTitle: 'Berlin Details',
      modalDesc: 'Berlin\'s history shines at the Berlin Wall and Brandenburg Gate, with a thriving arts scene and beer gardens.'
    },
    {
      id: 'athensModal',
      title: 'Athens',
      desc: 'Visit ancient ruins and enjoy authentic Greek cuisine.',
      image: sdfxc,
      modalTitle: 'Athens Details',
      modalDesc: 'Athens is home to the Acropolis and Parthenon, with lively plazas and authentic Greek souvlaki.'
    }
  ];

  const songRecommendations = {
    Paris: [
      { title: 'La Vie en Rose', artist: 'Édith Piaf', gif: 'https://makeagif.com/i/a2DgG2' },
      { title: 'Non, Je Ne Regrette Rien', artist: 'Édith Piaf', gif: 'https://tenor.com/view/marion-cotillard-edith-piaf-je-ne-regrette-rien-aucuns-regrets-gif-13090151.gif' },
      { title: 'Sous le Ciel de Paris', artist: 'Yves Montand', gif: 'https://i.gifer.com/95na.gif' }
    ],
    Rome: [
      { title: 'Volare', artist: 'Domenico Modugno', gif: 'https://media.giphy.com/media/2t9ybdQO3tffbegOuM/giphy.gif' },
      { title: 'Arrivederci Roma', artist: 'Dean Martin', gif: 'https://tenor.com/view/dean-martin-gif-22307648.gif' },
      { title: 'Funiculì Funiculà', artist: 'Traditional', gif: 'https://tenor.com/view/99-luftballons-nena-gif-13883846.gif' }
    ],
    Barcelona: [
      { title: 'Barcelona', artist: 'Freddie Mercury & Montserrat Caballé', gif: 'https://gifs.com/gif/barcelona-live-freddie-mercury-montserrat-caballe-1988-yNjbq7.gif' },
      { title: 'Viva La Vida', artist: 'Coldplay', gif: 'https://tenor.com/view/viva-la-vida-coldplay-france-jamcat-catjam-gif-15454284758777349905.gif' },
      { title: 'Bamboleo', artist: 'Gipsy Kings', gif: 'https://makeagif.com/i/srlwA1.gif' }
    ],
    London: [
      { title: 'London Calling', artist: 'The Clash', gif: 'https://makeagif.com/i/xn7A-y.gif' },
      { title: 'Waterloo Sunset', artist: 'The Kinks', gif: 'https://media.giphy.com/media/VEgfqKIEwl1InUdayp/giphy.gif' },
      { title: 'Sweet Caroline', artist: 'Neil Diamond', gif: 'https://tenor.com/view/sweet-caroline-neil-diamond-sweet-caroline-song-oh-my-darling-caroline-my-beloved-caroline-gif-19540818.gif' }
    ],
    Berlin: [
      { title: 'Heroes', artist: 'David Bowie', gif: 'https://tenor.com/view/david-bowie-we-can-be-heroes-hero-heroes-gif-4921430.gif' },
      { title: '99 Luftballons', artist: 'Nena', gif: 'https://tenor.com/view/99luftballons-nena-neun-und-neunzig-99red-balloons-ninety-nine-gif-16353538.gif' },
      { title: 'Born to Die in Berlin', artist: 'Ramones', gif: 'https://media.giphy.com/media/2t9ybdQO3tffbegOuM/giphy.gif' }
    ],
    Athens: [
      { title: 'Zorba’s Dance', artist: 'Mikis Theodorakis', gif: 'https://i.gifer.com/95na.gif' },
      { title: 'Never on Sunday', artist: 'Manos Hatzidakis', gif: 'https://i.gifer.com/95na.gif' },
      { title: 'Siko Horepse Syrtaki', artist: 'Traditional', gif: 'https://i.gifer.com/95na.gif' }
    ]
  };

  return (
    <div className={neonMode ? 'neon-mode' : ''}>
      <style>
        {`
          @keyframes flash {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.7; }
            100% { transform: scale(1); opacity: 0; }
          }
          @keyframes lightning {
            0% { opacity: 0; transform: scale(1); }
            10% { opacity: 1; transform: scale(1.2); }
            20% { opacity: 0; transform: scale(1); }
            30% { opacity: 1; transform: scale(1.1); }
            40% { opacity: 0; transform: scale(1); }
            100% { opacity: 0; transform: scale(1); }
          }
        `}
      </style>
      <header>
        <img 
          src={logo} 
          alt="Travel Vista Logo" 
          className="logo" 
          onClick={handleLogoClick}
          onDoubleClick={handleLogoDoubleClick}
          style={{ cursor: 'pointer' }}
        />
        <nav>
          <a className={activeNav === 'home' ? 'active' : ''} onClick={() => scrollToSection(homeRef, 'home')} aria-label="Home">Home</a>
          <a className={activeNav === 'destinations' ? 'active' : ''} onClick={() => scrollToSection(destinationsRef, 'destinations')} aria-label="Destinations">Destinations</a>
          <a className={activeNav === 'favorites' ? 'active' : ''} onClick={() => scrollToSection(favoritesRef, 'favorites')} aria-label="Favorites">Favorites</a>
          <a className={activeNav === 'about' ? 'active' : ''} onClick={() => scrollToSection(aboutRef, 'about')} aria-label="About">About</a>
          <a className={activeNav === 'contact' ? 'active' : ''} onClick={() => scrollToSection(contactRef, 'contact')} aria-label="Contact">Contact</a>
          <a className={activeNav === 'board' ? 'active' : ''} onClick={() => scrollToSection(boardRef, 'board')} aria-label="Discussion Board">Board</a>
          <a className={activeNav === 'planner' ? 'active' : ''} onClick={() => scrollToSection(plannerRef, 'planner')} aria-label="Travel Planner">Travel Planner</a>
          <a className={activeNav === 'songs' ? 'active' : ''} onClick={() => scrollToSection(songsRef, 'songs')} aria-label="Song Recommendations">Songs</a>
        </nav>
        <button
          className={`mode-toggle-btn ${neonMode ? 'neon-active' : ''}`}
          onClick={toggleNeonMode}
          aria-label={neonMode ? 'Switch to default mode' : 'Switch to neon mode'}
        >
          {neonMode ? '☀️' : '🌙'}
        </button>
      </header>
      
      <section className="hero" ref={homeRef}>
        <h2>Discover Your Next Adventure</h2>
      </section>
      <section className="destinations" ref={destinationsRef}>
        {destinations.map((dest) => (
          <div key={dest.id} className="destination-card">
            <img src={dest.image} alt={dest.title} onClick={() => { openModal(dest.id); enlargeImage(dest.image); }} />
            <div className="overlay">
              <h3>{dest.title}</h3>
              <button
                onClick={() => toggleFavorite(dest.title)}
                className={`favorite-btn ${favorites.includes(dest.title) ? 'favorited' : ''}`}
                aria-label={favorites.includes(dest.title) ? `Remove ${dest.title} from favorites` : `Add ${dest.title} to favorites`}
              >
                {favorites.includes(dest.title) ? '❤️ Remove Favorite' : '♡ Add to Favorites'}
              </button>
            </div>
            <p>{dest.desc}</p>
          </div>
        ))}
      </section>
      {destinations.map((dest) => (
        <Modal
          key={dest.id}
          isOpen={activeModal === dest.id}
          onClose={closeModal}
          title={dest.modalTitle}
          desc={dest.modalDesc}
          onClickOutside={(e) => { if (e.target.className === 'modal') closeModal(); }}
        />
      ))}
      <section id="favorites" ref={favoritesRef} className="favorites-section">
        <SectionHeader title="My Favorites" />
        {favorites.length === 0 ? (
          <p className="no-content">No favorites yet. Add some from the Destinations section!</p>
        ) : (
          <div className="destinations">
            {getFavoriteDestinations().map((dest) => (
              <div key={dest.id} className="destination-card">
                <img src={dest.image} alt={dest.title} onClick={() => { openModal(dest.id); enlargeImage(dest.image); }} />
                <div className="overlay">
                  <h3>{dest.title}</h3>
                  <button
                    onClick={() => toggleFavorite(dest.title)}
                    className="favorite-btn favorited"
                    aria-label={`Remove ${dest.title} from favorites`}
                  >
                    ❤️ Remove Favorite
                  </button>
                </div>
                <p>{dest.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      <section id="songs" ref={songsRef} className="songs-section">
        <SectionHeader title="Song Recommendations" />
        <div className="song-form">
          <div className="form-group">
            <select
              name="songDestination"
              value={selectedSongDestination}
              onChange={handleSongDestinationChange}
              className="form-input"
            >
              <option value="">Select Destination</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.title}>{dest.title}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="songs-list">
          {selectedSongDestination && songRecommendations[selectedSongDestination] ? (
            songRecommendations[selectedSongDestination].map((song, index) => (
              <div key={index} className="song">
                <img 
                  src={song.gif} 
                  alt={`GIF for ${song.title} by ${song.artist}`} 
                  className="song-gif"
                  onClick={() => enlargeImage(song.gif)}
                />
                <div className="song-details">
                  <h3>{song.title}</h3>
                  <p>Artist: {song.artist}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-content">Select a destination to see song recommendations!</p>
          )}
        </div>
      </section>
      <section id="about" ref={aboutRef} className="about-section">
        <SectionHeader title="About Us" />
        <p className="section-text">Travel Vista is your guide to unforgettable adventures, offering inspiration and tips for exploring the world’s most beautiful destinations.</p>
      </section>
      <section id="contact" ref={contactRef} className="contact-section">
        <SectionHeader title="Contact Us" />
        <p className="section-text">Get in touch at <a href="mailto:info@travelvista.com" className="contact-link">info@travelvista.com</a> for travel inquiries or collaborations.</p>
      </section>
      <section id="board" ref={boardRef} className="board-section">
        <SectionHeader title="Travel Discussion Board" />
        <div className="post-form">
          <div className="form-group">
            <input
              type="text"
              name="title"
              value={newPost.title}
              onChange={handlePostChange}
              placeholder="Post Title"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <textarea
              name="content"
              value={newPost.content}
              onChange={handlePostChange}
              placeholder="Share your travel experience..."
              className="form-input"
              rows="4"
            ></textarea>
          </div>
          <button
            onClick={handlePostSubmit}
            className="submit-btn"
            aria-label="Submit post"
          >
            Submit Post
          </button>
        </div>
        <div className="posts-list">
          {posts.length === 0 ? (
            <p className="no-content">No posts yet. Be the first to share!</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p className="post-date">Posted on: {post.date}</p>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="delete-btn"
                  aria-label={`Delete post: ${post.title}`}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>
      <section id="planner" ref={plannerRef} className="planner-section">
        <SectionHeader title="Travel Planner" />
        <div className="trip-form">
          <div className="form-group">
            <select
              name="destination"
              value={newTrip.destination}
              onChange={handleTripChange}
              className="form-input"
            >
              <option value="">Select Destination</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.title}>{dest.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              type="date"
              name="startDate"
              value={newTrip.startDate}
              onChange={handleTripChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="date"
              name="endDate"
              value={newTrip.endDate}
              onChange={handleTripChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <textarea
              name="notes"
              value={newTrip.notes}
              onChange={handleTripChange}
              placeholder="Add notes for your trip..."
              className="form-input"
              rows="4"
            ></textarea>
          </div>
          <button
            onClick={handleTripSubmit}
            className="submit-btn"
            aria-label={editingTrip ? 'Update trip' : 'Add trip'}
          >
            {editingTrip ? 'Update Trip' : 'Add Trip'}
          </button>
        </div>
        <div className="trips-list">
          {trips.length === 0 ? (
            <p className="no-content">No trips planned yet. Start planning your adventure!</p>
          ) : (
            trips.map((trip) => (
              <div key={trip.id} className="trip">
                <h3>{trip.destination}</h3>
                <p>From: {trip.startDate} To: {trip.endDate}</p>
                <p>{trip.notes || 'No notes'}</p>
                <div className="trip-actions">
                  <button
                    onClick={() => handleEditTrip(trip)}
                    className="edit-btn"
                    aria-label={`Edit trip to ${trip.destination}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="delete-btn"
                    aria-label={`Delete trip to ${trip.destination}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <footer>
        <div className="social-icons">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        </div>
        <p>&copy; 2025 Travel Vista. All rights reserved.</p>
      </footer>
      {enlargedImage && (
        <div className="enlarged-image" onClick={closeEnlargedImage}>
          <img src={enlargedImage} alt="Enlarged" />
          <span className="close" onClick={closeEnlargedImage}>&times;</span>
        </div>
      )}
      {isFlashing && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, pointerEvents: 'none', background: 'rgba(255, 255, 255, 0.3)' }}>
          <span 
            style={{ fontSize: '200px', color: 'gold', textShadow: '0 0 20px orange', animation: 'flash 0.5s ease-in-out' }} 
            onAnimationEnd={() => setIsFlashing(false)}
          >
            ☀️
          </span>
        </div>
      )}
      {showLightning && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, pointerEvents: 'none', background: 'rgba(0, 0, 0, 0.3)' }}>
          <span 
            style={{ fontSize: '300px', color: 'white', textShadow: '0 0 30px yellow, 0 0 60px yellow', animation: 'lightning 1s ease-in-out' }} 
            onAnimationEnd={() => setShowLightning(false)}
          >
            ⚡
          </span>
        </div>
      )}
    </div>
  );
};

export default App;