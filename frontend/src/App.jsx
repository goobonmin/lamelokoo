import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ds from "./image/ds.png";
import logo from "./image/logo.png";
import go from "./image/go.png";
import g from "./image/g.png";
import q from "./image/q.png";
import f from "./image/f.png";
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

  const homeRef = useRef(null);
  const destinationsRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const boardRef = useRef(null);
  const plannerRef = useRef(null);
  const favoritesRef = useRef(null);

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

  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem('travelPlans')) || [];
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setTrips(savedTrips);
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('travelPlans', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  const getFavoriteDestinations = () => 
    destinations.filter((dest) => favorites.includes(dest.title));

  return (
    <div>
      <header>
        <img src={logo} alt="Travel Vista Logo" className="logo" />
        <nav>
          <a className={activeNav === 'home' ? 'active' : ''} onClick={() => scrollToSection(homeRef, 'home')} aria-label="Home">Home</a>
          <a className={activeNav === 'destinations' ? 'active' : ''} onClick={() => scrollToSection(destinationsRef, 'destinations')} aria-label="Destinations">Destinations</a>
          <a className={activeNav === 'favorites' ? 'active' : ''} onClick={() => scrollToSection(favoritesRef, 'favorites')} aria-label="Favorites">Favorites</a>
          <a className={activeNav === 'about' ? 'active' : ''} onClick={() => scrollToSection(aboutRef, 'about')} aria-label="About">About</a>
          <a className={activeNav === 'contact' ? 'active' : ''} onClick={() => scrollToSection(contactRef, 'contact')} aria-label="Contact">Contact</a>
          <a className={activeNav === 'board' ? 'active' : ''} onClick={() => scrollToSection(boardRef, 'board')} aria-label="Discussion Board">Board</a>
          <a className={activeNav === 'planner' ? 'active' : ''} onClick={() => scrollToSection(plannerRef, 'planner')} aria-label="Travel Planner">Travel Planner</a>
        </nav>
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
            <h3>{dest.title}</h3>
            <p>{dest.desc}</p>
            <button
              onClick={() => toggleFavorite(dest.title)}
              className={`favorite-btn ${favorites.includes(dest.title) ? 'favorited' : ''}`}
              aria-label={favorites.includes(dest.title) ? `Remove ${dest.title} from favorites` : `Add ${dest.title} to favorites`}
            >
              {favorites.includes(dest.title) ? '❤️ Remove Favorite' : '♡ Add to Favorites'}
            </button>
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
                <h3>{dest.title}</h3>
                <p>{dest.desc}</p>
                <button
                  onClick={() => toggleFavorite(dest.title)}
                  className="favorite-btn favorited"
                  aria-label={`Remove ${dest.title} from favorites`}
                >
                  ❤️ Remove Favorite
                </button>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
};

export default App;