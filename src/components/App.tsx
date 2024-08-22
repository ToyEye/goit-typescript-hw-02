import { useState, useEffect } from 'react';
import fetchImages from './Api/unsplash-api';
import SearchBar from './SearchBar/SearchBar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import LoadMoreBtn from './LoadMoreBtn/LoadMoreBtn';
import ImageModal from './ImageModal/ImageModal';
import { Toaster } from 'react-hot-toast';
import Footer from './Footer/Footer';
import s from './App.module.css';

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [noImages, setNoImages] = useState(false);

  useEffect(() => {
    if (!query) return;

    const getImages = async () => {
      setLoading(true);
      setNoImages(false);
      setTimeout(async () => {
        try {
          const newImages = await fetchImages(query, page);
          if (newImages.length === 0 && page === 1) {
            setNoImages(true);
          }
          setImages(prevImages => [...prevImages, ...newImages]);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }, 1000);
    };

    getImages();
  }, [query, page]);

  const handleSearch = searchQuery => {
    setQuery(searchQuery);
    setImages([]);
    setPage(1);
    setError(null);
    setNoImages(false);
  };

  const handleLoadMore = () => setPage(prevPage => prevPage + 1);

  const handleImageClick = image => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="App">
      <SearchBar onSubmit={handleSearch} />
      {error && <ErrorMessage message={error} />}
      {noImages && !loading && <p className={s.error}>No images found</p>}
      <ImageGallery images={images} onImageClick={handleImageClick} />
      {loading && <Loader />}
      {images.length > 0 && !loading && (
        <LoadMoreBtn onClick={handleLoadMore} />
      )}
      {selectedImage && (
        <ImageModal
          isOpen={showModal}
          onRequestClose={handleCloseModal}
          image={selectedImage}
        />
      )}
      {images.length > 0 && <Footer />}
      <Toaster />
    </div>
  );
};

export default App;
