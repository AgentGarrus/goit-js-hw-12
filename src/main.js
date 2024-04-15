import axios from 'axios';
import { fetchImages } from './js/pixabay-api.js';
import { showMessage } from './js/render-functions.js';
import { createImageCard } from './js/render-functions.js';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');
const lightbox = new SimpleLightbox('.gallery a', {});
let currentPage = 1;
let currentQuery = '';

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showLoadMoreBtn() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreBtn() {
  loadMoreBtn.style.display = 'none';
}

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSubmit(event) {
  event.preventDefault();
  
  const query = event.target.search.value.trim();
  
  if (!query) {
    showMessage('Please enter a search query');
    return;
  }

  currentPage = 1;
  currentQuery = query;
  
  try {
    showLoader();
    gallery.innerHTML = '';
    
    const images = await fetchImages(query);
    if (images.length === 0) {
      showMessage('Sorry, there are no images matching your search query. Please try again!');
    } else {
      renderGallery(images);
      showLoadMoreBtn();
    }
  } catch (error) {
    showMessage('An error occurred while fetching images. Please try again later.');
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  currentPage++;
  
  try {
    showLoader();
    const images = await fetchImages(currentQuery, currentPage);
    if (images.length === 0) {
      hideLoadMoreBtn();
      showMessage("We're sorry, but you've reached the end of search results.");
    } else {
      renderGallery(images);
      smoothScrollByGalleryHeight();
    }
  } catch (error) {
    showMessage('An error occurred while fetching more images. Please try again later.');
  } finally {
    hideLoader();
  }
}

function renderGallery(images) {
  const cardsMarkup = images.map(createImageCard).join('');
  gallery.insertAdjacentHTML('beforeend', cardsMarkup);
  
  lightbox.refresh();
}

function smoothScrollByGalleryHeight() {
  const galleryHeight = gallery.getBoundingClientRect().height * 2;
  window.scrollBy({
    top: galleryHeight,
    behavior: 'smooth'
  });
}