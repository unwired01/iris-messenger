import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'preact/hooks';

import Events from '../../../nostr/Events';
import Key from '../../../nostr/Key';
import SocialNetwork from '../../../nostr/SocialNetwork';

const Repost = ({ event }) => {
  const [state, setState] = useState({
    reposts: 0,
    reposted: false,
    repostedBy: new Set<string>(),
  });

  useEffect(() => {
    const unsubProfile = SocialNetwork.getProfile(event.pubkey, (profile) => {
      if (!profile) return;
    });

    const unsubReposts = Events.getReposts(event.id, handleReposts);

    return () => {
      unsubProfile();
      unsubReposts();
    };
  }, [event]);

  const handleReposts = (repostedBy) => {
    const myPub = Key.getPubKey();
    setState((prevState) => ({
      ...prevState,
      reposts: repostedBy.size,
      reposted: repostedBy.has(myPub),
      repostedBy,
    }));
  };

  const repostBtnClicked = (e) => {
    e.preventDefault();
    e.stopPropagation();
    repost(!state.reposted);
  };

  const repost = (reposted = true) => {
    if (reposted) {
      const author = event.pubkey;
      const hexId = Key.toNostrHexAddress(event.id);
      if (hexId) {
        Events.publish({
          kind: 6,
          tags: [
            ['e', hexId, '', 'mention'],
            ['p', author],
          ],
          content: '',
        });
      }
    }
  };

  return (
    <a
      className={`btn-ghost btn-sm hover:bg-transparent btn content-center gap-2 rounded-none ${
        state.reposted ? 'text-iris-green' : 'hover:text-iris-green text-neutral-500'
      }`}
      onClick={(e) => repostBtnClicked(e)}
    >
      <ArrowPathIcon width={18} />
      {state.reposts || ''}
    </a>
  );
};

export default Repost;
