import React from 'react';

const ReferralCard = ({ referral }) => {
    return (
        <div className="referral-card">
            <h3>{referral.title}</h3>
            <p>{referral.description}</p>
        </div>
    );
};

export default ReferralCard;
