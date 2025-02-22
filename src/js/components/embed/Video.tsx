import Embed from './index';

const Video: Embed = {
  regex: /(https?:\/\/\S+?\.(?:mp4|webm|ogg|mov)(?:\?\S*)?)/gi,
  settingsKey: 'enableVideo',
  component: ({ match }) => (
    <div className="relative w-full object-contain my-2 min-h-96">
      <video
        className="rounded max-h-[70vh] md:max-h-96"
        src={match}
        controls
        muted
        autoPlay
        playsInline
        loop
        poster={`https://imgproxy.iris.to/thumbnail/638/${match}`}
      ></video>
    </div>
  ),
};

export default Video;
