import React from 'react';

// The UserProfile component receives props for name, age, and bio.
const UserProfile = (props) => {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>Bio: {props.bio}</p>
    </div>
  );
};

// The main App component renders the UserProfile with your details.
const App = () => {
  return (
    <UserProfile
      name="Kidlat"
      age={30}
      bio="Front-End-Developer"
    />
  );
};

export default App;
