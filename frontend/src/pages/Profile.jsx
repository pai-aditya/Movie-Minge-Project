import TitleCard from "../components/TitleCard";

const Profile = ( userDetails) => {
  const { displayName, reviews, watchlist, lists } = userDetails.user.user;

  return (
    <div className="w-full bg-custom-primary-purple text-white p-8">
    <div className='flex items-center justify-beteween my-4 mr-4 '>
        <TitleCard />
      </div>
      <h1 className="text-4xl font-bold mb-8 mt-8 text-center">Welcome, {displayName}!</h1>
      <div className="mb-6 text-center">
        <p className="text-lg my-2">
          You have reviewed <span className="text-yellow-300">{reviews.length}</span> movies
        </p>
        <p className="text-lg my-2">
          You have <span className="text-yellow-300">{watchlist.length}</span> movies in your watchlist
        </p>
        <p className="text-lg my-2">
          You have created <span className="text-yellow-300">{lists.length}</span> lists
        </p>
      </div>
    </div>
  );
};

export default Profile;
