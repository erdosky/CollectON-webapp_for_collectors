import React, { useState, useEffect } from 'react';
import './css/MyCollections.css';
import './css/CollectionForm.css';
import axios from 'axios';
import UserCollections from '../collections/UserCollections';

const MyCollections = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCollections, setUserCollections] = useState([]);
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [showPopupValidationFailed, setShowPopupValidationFailed] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    email: localStorage.getItem('email'),
    image: '',
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDialog = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) {
      fetchCollections();
    }
  };

  const convertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = {
      method: 'post',
      url: 'http://localhost:3000/collectionForm',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      data: formData,
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toggleDialog();
          setShowPopupAdd(true);
          setTimeout(function () {
            setShowPopupAdd(false);
          }, 1500);
        }
      })
      .catch((error) => {
        setShowPopupValidationFailed(true);
        setTimeout(function () {
          setShowPopupValidationFailed(false);
        }, 2000);
        console.error(error);
      });
  };

  const fetchCollections = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const response = await axios.get(`http://localhost:3000/getUserCollections:${email}`, {
        headers: {
          'x-access-token': token,
        },
      });
      setUserCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections: ', error);
    }
  };

  const deleteCollection = async (collectionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:3000/collection/delete:${collectionId}`, {
        headers: {
          'x-access-token': token,
        },
      });
      if (response.status === 200) {
        await fetchCollections();
        setShowPopupDelete(true);
        setTimeout(function () {
          setShowPopupDelete(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error deleting collection: ', error);
    }
  };

  return (
    <>
    <div className='myCollectionsContainer'>
      <div className='ProfileTitle'>My Collections</div>
      <div className='userCollections'>
        <div className='collection__container'>
          {userCollections.length !== 0 ? 
          <UserCollections collections={userCollections} deleteCollection={deleteCollection} setUserCollections={setUserCollections} />
          : <span className='loader'>  </span> }
          
        </div>
      </div>

      <button className='create__collection__button' onClick={toggleDialog}>
        Create new collection
      </button>

      <dialog className='modal' open={isModalOpen}>
        <form className="collectionForm" onSubmit={handleSubmit}>
          <div className='formTitle'>Create new collection</div>
          <div>
            <input type='text' className='form__input' name='name' placeholder='Name' onChange={handleChange} value={formData.name} required />
          </div>
          <div >
            <select className='form__input' name='type' onChange={handleChange} value={formData.type} required>
              <option value=''>Type</option>
              <option value='Coins'>Coins</option>
              <option value='Stamps'>Stamps</option>
              <option value='Paintings'>Paintings</option>
              <option value='Sculptures'>Sculptures</option>
              <option value='Postcards'>Postcards</option>
              <option value='Banknotes'>Banknotes</option>
              <option value='Weapons'>Weapons</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div>
            <textarea className='form__input' name='description' placeholder='Description' onChange={handleChange} value={formData.description} rows={4} required />
          </div>
          <div>
            <input type='file' className='form__input' name='image' onChange={convertToBase64} required />
          </div>
          <div className='modal__actions'>
            <button className='modal-button' type='submit'>
              Add
            </button>
            <button className='modal-button' onClick={toggleDialog} type='button'>
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </div>

      {showPopupDelete && (
  <div className="popup">
    <div className="popup-content">
       <b> Collection has been deleted. </b>
        <br></br>
    </div>
  </div>
)}

      {showPopupAdd && (
        <div className="popup">
          <div className="popup-content">
             <b> Collection has been added. </b>
              <br></br>
          </div>
          </div>
          )}

           {showPopupValidationFailed && (
        <div className="popup">
          <div className="popup-content">
            <b>Validation failed.</b>
            <br></br>
            <b>Something went wrong.</b>
          </div>
        </div>
      )}
  
    </>
  );
};

export default MyCollections;
