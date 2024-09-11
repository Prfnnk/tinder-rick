const Buttons = ({ interactCard }) => {
  return (
    <div className="buttons mt-8 flex gap-x-4 justify-center">
      <button onClick={() => interactCard('skip')}>Toss</button>
      <button onClick={() => interactCard('like')}>Like</button>
    </div>
  );
};
export default Buttons;
