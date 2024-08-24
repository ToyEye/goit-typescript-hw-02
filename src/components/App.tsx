import React, { useState, useEffect } from 'react';
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
import { Images } from '../types/images';
const App: React.FC = () => {
  const [images, setImages] = useState<Images[]>([]);
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Images | null>(null);
  const [noImages, setNoImages] = useState(false);

  useEffect(() => {
    if (!query) return;

    const getImages = async (): Promise<void> => {
      setLoading(true);
      setNoImages(false);
      setTimeout(async () => {
        try {
          const newImages: Images[] = (await fetchImages(query, page));
          if (newImages.length === 0 && page === 1) {
            setNoImages(true);
          }
          setImages(prevImages => [...prevImages, ...newImages]);
        } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
          setLoading(false);
        }
      }, 1000);
    };

    getImages();
  }, [query, page]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setImages([]);
    setPage(1);
    setError(null);
    setNoImages(false);
  };

  const handleLoadMore: () => void = () => setPage(prevPage => prevPage + 1);

  const handleImageClick: (image: Images) => void = image => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal: () => void = () => setShowModal(false);

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
