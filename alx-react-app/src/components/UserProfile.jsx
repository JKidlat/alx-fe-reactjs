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

// The main App component renders the UserProfile with the specific details
// required by the test.
const App = () => {
  return (
    <UserProfile
      name="Alice"
      age={25}
      bio="Loves hiking and photography"
    />
  );
};

export default App;
