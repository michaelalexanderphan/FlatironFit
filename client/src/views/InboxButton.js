import React, { useState } from 'react';

function InboxButton({ onClick }) {
  return (
    <div>
      <button className="btn-send-message" onClick={onClick}>
        Send Message
      </button>
    </div>
  );
}

export default InboxButton;
