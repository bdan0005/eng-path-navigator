import Button from './components/Button';

function App() {
  return (
    <div className="p-4">
      <Button
        type="primary"
        text="Submit"
        handleClick={() => alert('Clicked!')}
      />
    </div>
  );
}

export default App;
