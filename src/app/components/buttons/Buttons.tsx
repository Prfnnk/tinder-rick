const Buttons = ({ interactCard }) => {
  return (
    <div className="buttons mt-8 flex gap-x-4 justify-center">
      <button
        className="rounded-full min-w-20 bg-gray-200 hover:bg-gray-300 transition-colors"
        onClick={() => interactCard('skip')}
      >
        Toss
      </button>
      <button
        className="rounded-full min-w-20 p-3 bg-pink-100 hover:bg-pink-200 transition-colors"
        onClick={() => interactCard('like')}
      >
        Like
      </button>
    </div>
  );
};
export default Buttons;
