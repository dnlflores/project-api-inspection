import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addReviewThunk } from '../../store/reviews';
import { useModal } from '../../context/Modal'
import { getSingleSpotThunk } from '../../store/spots';
export default function CreateReviews({ spotId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const [url, setUrl] = useState('');
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(5);
  const [errors, setErrors] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (currentUser) setErrors([]);
    else setErrors(['Log in to leave a review']);
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setHasSubmitted(true);

    const errorsArr = [];
    if (!review.length || review.length > 150)
      errorsArr.push('Enter a valid review fewer than 150 characters long');

    setErrors(errorsArr);
    if (errorsArr.length) return;
    const reviewInfo = { review, stars, url };

    const newReview = await dispatch(
      addReviewThunk(reviewInfo, spotId, currentUser)
    ).catch(async (res) => {
      const message = await res.json();
      const messageErrors = [];

      if (message) {
        messageErrors.push(message.error);
        errorsArr.push(message.error);
        setErrors(messageErrors);
      }
    });
    if (newReview && !url.length) {
      closeModal();
      dispatch(getSingleSpotThunk(spotId))
      history.push(`/spots/${spotId}`);
    }

  };

  return (
    <div>
      <div className="modalHead">Leave a Review</div>

      <div>
        {hasSubmitted &&
          errors &&
          errors.map((error) => <div style={{color:'red'}} key={error}>{error}</div>)}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-wrapper">
          <label className="form-label">
            Rating:&nbsp;
            <select
              type="number"
              value={stars}
              onChange={(e) => setStars(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option>{num}</option>
              ))}
            </select>
          </label>
          <div className="line"></div>
          <label className="form-label">
            Review:
            <textarea
              type="text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </label>
          <div className="line"></div>
          <div className=""></div>
        </div>

        <button className="modal-submit-button">Create Review</button>
      </form>
    </div>
  );
};
