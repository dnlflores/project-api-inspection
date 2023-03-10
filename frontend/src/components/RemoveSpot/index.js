import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { removeSpotThunk } from '../../store/spots';
import { useModal } from '../../context/Modal';
import './RemoveSpot.css';

export default function RemoveSpot({spotId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { noModal } = useModal();
    // const thisSpot = spot.spot;

    const [error, setError] = useState([]);
    const revert = (i) => {
        i.preventDefault();
        noModal();
    }
    const deleteNow = async (i) => {
        i.preventDefault();
        const deletion = await dispatch(
            removeSpotThunk(spotId)
        ).catch(async (res) => {
            const datas = await res.json();
            if (datas) {
                if (datas.error) {
                    setError(datas.error);
                }
            }
        });
        noModal();
        history.pushState('/');
    }

    return (
        <div className="form-div">
            <h1 className="title">Confirm deletion of this Spot</h1>
            <ul className="error">
                {error.map((err, j) => {
                    <li key={j}>{err}</li>
                })}
            </ul>
            <form className="form">
                <button type="submit" className="submit-button" id="removeSpot-button" onClick={deleteNow}>Delete Now</button>
            </form>
        </div>
    )
}
